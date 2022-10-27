const fs = require('fs')

let products = []

class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    async postProduct(req){
        try{
            let products = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            let parseProducts = await JSON.parse(products)

            let id = parseProducts.length + 1
            let { title, price, thumbnail } = req.body
            
            const newProduct = {
                "title":title,
                "price":price,
                "thumbnail":thumbnail,
                "id":id
            }

            parseProducts.push(newProduct)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(parseProducts, null, "\t"))
            
            return newProduct
            
        } catch(error) {
            console.log(`Error al guardar: ${error}`)
        }
    }

    async getById(req){
        try{
            let { id } = req.params
            let productos = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            let parseProducts = await JSON.parse(productos)
            let searchId = parseProducts.find(element => element.id == id)

            if(searchId){
                return searchId
            } else {
                return {error: `Producto con id ${id} no encontrado`}
            }
        }catch (error){
            console.log(`Error al leer archivo: ${error}`)
        }
    }

    async getAll(){
        try {
            let productos = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            const parseProducts = await JSON.parse(productos)
            return parseProducts
        } catch (error) {
            console.log(`Error al leer archivo: ${error}`)
        }
    }

    async deleteById(req){
        try {
            let { id } = req.params

            let productos = await fs.promises.readFile(`./${this.nombreArchivo}`, "utf-8")
            let parseProducts = JSON.parse(productos)
            const filterProducts = parseProducts.filter(element => element.id != id)
            
            await fs.promises.unlink(`./${this.nombreArchivo}`)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(filterProducts, null, "\t"))
            
            return `Nuevo stock:`, filterProducts
        } catch (error) {
            console.log(`Error al leer archivo: ${error}`)
        }
    }

    async modifyById(req){
        try {
            let products = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            let parseProducts = await JSON.parse(products)
            let { id } = req.params
            let { title, price, thumbnail } = req.body

            const filterProducts = parseProducts.map((element) =>{
                if(element.id == id){
                   return {
                    title: title,
                    price:price,
                    thumbnail:thumbnail,
                    id: element.id
                   }
                } else {
                    return element
                }
            })

            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(filterProducts, null, "\t"))

            return filterProducts

        } catch (error) {
            console.log(`Error al leer archivo: ${error}`)
        }
    }

    async deleteAll(){
        try {
            await fs.promises.unlink(`./${this.nombreArchivo}`)

            products = []
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(products, null, "\t"))
            console.log("Productos eliminados: ", products)
        } catch (error) {
            console.log(`Error al eliminar archivo: ${error}`)
        }
    }
}


//const archivo = new Contenedor("productos.txt")

//CREACION, LLAMADO y ELIMINADO DE PRODUCTOS DISCOS LED ZEPPELIN
// Metodo SAVE 
/*archivo.save({
    title:"Led Zeppelin: Celebration Day",
    price: 670,
    thumbnail: "https://discography.ledzeppelin.com/images/cd.jpg"
})

archivo.save({
    title:"Led Zeppelin: Mothership",
    price: 580,
    thumbnail: "https://discography.ledzeppelin.com/images/ms.jpg"
})

archivo.save({
    title:"Led Zeppelin: The Complete BBC Sessions",
    price: 450,
    thumbnail: "https://discography.ledzeppelin.com/images/bbc.jpg"
})

archivo.save({
    title:"Led Zeppelin: Led Zeppelin IV",
    price: 800,
    thumbnail: "https://discography.ledzeppelin.com/images/lz4.jpg"
})

archivo.save({
    title:"Led Zeppelin: Led Zeppelin II",
    price: 790,
    thumbnail: "https://discography.ledzeppelin.com/images/lz2.jpg"
})
*/

// GetById:
// archivo.getById(2).then( res =>{
//     console.log(res)
// })

// GetAll:
// archivo.getAll().then( res =>{
//     console.log(res)
// } )

// DeleteById:
// archivo.deleteById(2)


// DeleteAll:
// archivo.deleteAll()


export default Contenedor