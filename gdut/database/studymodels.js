module.exports = { 
	user:{ 
		name:{type:String,required:true},
		password:{type:String,required:true}
	},
	question_list :{
		question:{type:String,required:true,unique:true},
		answer_A:{type:String,required:true},
		answer_B:{type:String,required:true},
		answer_C:{type:String,required:true},
		answer_D:{type:String,required:true},
		correct:{type:String,required:true},
		question_img: {type:String,required:false},
		img_A: {type:String,required:false},
		img_B: {type:String,required:false},
		img_C: {type:String,required:false},
		img_D: {type:String,required:false}
	},
	question_list_multiple :{
		question:{type:String,required:true,unique:true},
		answer_A:{type:String,required:true},
		answer_B:{type:String,required:true},
		answer_C:{type:String,required:true},
		answer_D:{type:String,required:true},
		correct:{type:String,required:true},
		question_img: {type:String,required:false},
		img_A: {type:String,required:false},
		img_B: {type:String,required:false},
		img_C: {type:String,required:false},
		img_D: {type:String,required:false}
	},
	question_list_essay :{
		question:{type:String,required:true,unique:true},
		question_img: {type:String,required:false},
		answer :{type:String,required:true}
	}
};