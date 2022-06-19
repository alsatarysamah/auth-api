class collection{
  constructor(model){
      this.model=model;
  }
  ////////////creat=insert///////////////////////////
  
  async create(obj) {
      try {
          
  
          let newRecord = await this.model.create(obj);
          return newRecord;
      } catch (e) {
          console.log(e);
          console.error("error in creating a new record in model ", this.model)
  
      }
  }
  /////////////read//////////////////////////
  async read(id){
      try {
          let record = null;
        
          if (id) {
             
              record = await this.model.findOne({ where: { id:id } });
              return record;
          }
          else {
            
              record = await this.model.findAll();
              return record;
          }
  
      } catch (e) {
          console.error("error in reading record in model ", this.model)
      }
  
  }
  //////////////update///////////////////////
  async update(id,obj)
  {
  try{
  let updated = await this.model.update(obj);
  return updated;
  }
  catch(error){
      console.error("error while updating  record in ",this.model)
  
  }
  }
  ///////////////delete/////////////////
  async delete(id)
  {
      try{
          let deleted=null;
         deleted = await this.model.destroy({ where: { id: id} });
  return deleted;
      }
      catch(error){
          console.error("error while deleting  record in ",this.model)
  
      }
  }
  }
  
  module.exports=collection;



