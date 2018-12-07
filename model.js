class Model {
  static async get() {
    const data = await global.db.query(`SELECT * from ${this.table()}`);
    return data.map( el => {
      return this.buildEntityObject(el);
    })
  }


  static buildEntityObject(dataObject) {
    const entity = new this();

    for(let key in dataObject) {
      entity[key] = dataObject[key];
    }

    return entity;
  }

  static async find(id) {
    const data = await global.db.query(`SELECT * from ${this.table()} WHERE id = ?`, [id]);
    const dataObject = data[0];
    const entity = this.buildEntityObject(dataObject);
    await entity.buildRelations();
    return entity;
  }

  delete() {
    const id = this[this.pk];

    return global.db.query(`DELETE FROM ${this.constructor.table()} WHERE id = ?;`, [id]);
  }

  static async where(conditions = []){   //[['field', 'operator', 'value']]
    const conditionStr = conditions.reduce((acc, el, index, arr) => {
      const [field, operator] = el;

      return `${acc}AND ${field} ${operator} ? `;
    }, "").substr(4);   

    const dataObjects = await global.db.query(`SELECT * from ${this.table()} WHERE ${conditionStr}`, conditions.map(el => el[2]));

    return dataObjects.map( el => {
      return this.buildEntityObject(el);
    })
  }

  save() {
    const id = this[this.pk];

    if(id) {
      const questionSymbols = Array.from({length: this.fields.length - 1}, () => '?').join(', ');
      const keyValsString = this.fields.slice(1).map( el => {
        return this[el] !== undefined 
        ? `${el} = ?` 
        : `${el} = null` 
      });
      const avaibleValues = this.fields.slice(1).map( el => {
        return this[el]; 
      }).filter( el => el !== undefined);

      return global.db.query(`UPDATE ${this.constructor.table()} SET ${keyValsString} WHERE id = ?;`, [...avaibleValues, id]);

    } else {
      const questionSymbols = Array.from({length: this.fields.length - 1}, () => '?').join(', ');
      const values = this.fields.map( el => {
        return this[el] !== undefined ? this[el] : null;
      });

      return global.db.query(`INSERT INTO ${this.constructor.table()} (${this.fields.slice(1).join(', ')}) 
        VALUES (${questionSymbols})`,
        [...values.slice(1)]);
    }
  }

  async buildRelations() { //implemens different types of relations such as hasMany or hasOne or smsElse
    if(this.relations) {
      for(let i = 0; i < this.relations.length; i++) {
        const relation = this.relations[i];

        switch (relation) {
          case 'hasMany' :
            for(let j = 0; j < this[relation].length; j++) {
              const item = this[relation][j];

              this[item.model.table()] = await item.model.where([[item.foreignKey, '=', this[item.primaryKey]]]);

              this[`add${item.model.name}`] = async (entity) => {
                this[item.model.table()].push(entity);
                entity[item.foreignKey] = this.id;
                await entity.save();
              }
            }
          break;
        }
      }
    }
  }
}

module.exports = Model;
