


const MainModel 	= require(__path_schemas + 'category');
const ProductModel 	= require(__path_schemas + 'product');
module.exports = {
    listItem: (params, options) =>{
        let id = (params.id) ? params.id : ''
        params = (params.id) ? params.query : params
    // copy params
       let queryFind ={...params} 

    // Khai báo
       let find, select,sort;

    //    create field remove
       let removeFields = ['select', 'sort', 'page', 'limit']

        // remove fields 
       removeFields.forEach(item => delete queryFind[item])

       // create query string
       let queryStr = JSON.stringify(queryFind)

        // replace
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`)

        // parse
        find = JSON.parse(queryStr)

        // select field
        if (params.select) {
            select = params.select.split(',').join(' ')
        } 

        // sort field
        if (params.sort) {
            sort = params.sort.split(',').join(' ')
        } 

        // pagination
        let page = parseInt(params.page) || 1
        let limit = parseInt(params.limit) || 3
        let skip = (page-1)*limit
        
        if (options.task == 'all') {
            return MainModel
                .find(find)
                .populate({path: 'restaurants', select: 'name'})
                .select(select)
                .sort(sort)
                .skip(skip)
                .limit(limit)
        }
        if (options.task == 'getProduct') {
            if (id != 'all') Object.assign(find,{'category.id':id })
            return ProductModel
            .find(find)
            .populate({path: 'product', select: 'name'})
            .select(select)
            .sort(sort)
            .skip(skip)
            .limit(limit)
        }

    },
    create: (items)=>{
        return new MainModel(items).save();
    },
    deleteItem: (params, option) =>{
        return MainModel
            .deleteOne({_id: params.id})
    },
    editItem:(params, options)=>{
        if (options.task == 'edit') {
            return MainModel
                .updateOne({_id: params.id}, params.body)       
        }
    },
    
}
