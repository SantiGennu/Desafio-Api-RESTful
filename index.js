const express = require('express')
const app = express()
const { Router } = express

const Container = require('./components/api/index')
const products = new Container('./products.txt')

app.use(express.static('public'))


const routerProducts = new Router();
routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }))



routerProducts.get('/', async (req, res) => {
    const allProducts = await products.getAll()
    if (allProducts.length > 0) { res.json(allProducts) }
    else { res.sendStatus(400) }

});

app.use('/api/products', routerProducts)



routerProducts.get('/:id', async (req, res) => {
    const productId = await products.getById(req.params.id)
    if (productId) {
        res.json({
            search: `Producto con id : ${req.params.id}. Encontrado`,
            result: productId
        })
    }
    else { res.sendStatus(404) }
})


routerProducts.post('/', async (req, res) => {
    let addProduct = req.body

    if (addProduct) {
        await products.save(addProduct)
        res.json({
            newProduct: addProduct

        })
    }
    else { res.sendStatus(400) }

})


routerProducts.delete('/:id', async (req, res) => {
    let product = req.params.id
    try {
        await products.deleteById(product)
        res.json({

            products: await products.getAll(),

        })
    } catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
})



routerProducts.put('/:id', async (req, res) => {
    const result = await products.update(req.body)
    console.log(result)

    if (result.length > 0) {

        res.send(`
         product : ${JSON.stringify(result[1])}
         replaced : ${JSON.stringify(result[0])}
         position : ${result[0].id}
        `)
    }
    else {
        res.sendStatus(400)
    }
})


const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

