class Model {
  static find(id) {
    return global.db.query(`SELECT * from ${this.table()} WHERE id = ?`, [id])
    .then(data => data[0]
      ? data[0]
      : null)
    .catch( err => console.log(err));
  }

  load(id) {
  	  return this.constructor.find(id)
      .then(data => {
        for(let key in data) {
          this[key] = data[key];
        }
      });
  }

  static where(conditions = []){   //[['field', 'operator', 'value']]
    if(!conditions.length) return;
    const conditionStr = conditions.reduce((acc, el, index, arr) => {
      const [field, operator] = el;

      return `${acc}AND ${field} ${operator} ? `;
    }, "").substr(4);   

    return global.db.query(`SELECT * from ${this.table()} WHERE ${conditionStr}`, conditions.map(el => el[2]))
    .catch( err => console.log(err));
  }

  static get() {
  	return global.db.query(`SELECT * from ${this.table()}`);
  }

  save() {
    if(this.id) {
      const questionSymbols = Array.from({length: this.fields.length - 1}, () => '?').join(', ');
      const keyValsString = this.fields.slice(1).map( el => {
        return this[el] !== undefined 
        ? `${el} = ?` 
        : `${el} = null` 
      });

      const avaibleValues = this.fields.slice(1).map( el => {
        return this[el]; 
      }).filter( el => el !== undefined);


      return global.db.query(`UPDATE ${this.constructor.table()} SET ${keyValsString} WHERE id = ?;`, [...avaibleValues, this.id])
      .catch( err => console.log(err));

    } else {
      const questionSymbols = Array.from({length: this.fields.length - 1}, () => '?').join(', ');
      const values = this.fields.map( el => {
        return this[el] !== undefined ? this[el] : null;
      });

      return global.db.query(`INSERT INTO ${this.constructor.table()} (${this.fields.slice(1).join(', ')}) 
        VALUES (${questionSymbols})`,
        [...values.slice(1)])
        .catch( err => console.log(err));
    }
  }

  delete() {
      return global.db.query(`DELETE FROM ${this.constructor.table()} WHERE id = ?;`, [this.id]);
  }

  buildRelations() { //implemens different types of relations such as hasMany or hasOne or smsElse
    if(this.relations) {
      this.relations.forEach( relation => {
        switch (relation) {
          case 'hasMany' :
            this[relation].forEach( item => {
              this.__defineGetter__(item.model.table(), async () => {
                const entities = await item.model.where([[item.foreignKey, '=', this[item.primaryKey]]])

                const models = [];
                for(let i = 0; i < entities.length; i++) {
                  const obj = new item.model();
                  await obj.load(entities[i].id);
                  models.push(obj);
                }

                return models;

              })

              this[`add${item.model.name}`] = async (entity) => {
                entity[item.foreignKey] = this.id;
                await entity.save();
              }
            })
          break;
        }
      })
    }
  }
}

module.exports = Model;
