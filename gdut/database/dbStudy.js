var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./studymodels");

for(var m in models){ 
	mongoose.model(m,new Schema(models[m]));
}

module.exports = { 
	getModel: function(type){ 
		return mongoose.model(type);
	}
};
