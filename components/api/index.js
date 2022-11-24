let fs = require("fs")

class Container {
    constructor(file) {
        this.file = file


    }

    async writeFile(data) {
        try {
            await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2));

        } catch (error) {
            console.log(`error: ${error}`)
            throw new Error(error)

        }
    }

    async getAll() {
        try {
            let products = await fs.promises.readFile(this.file, 'utf-8')

            return JSON.parse(products)

        } catch (error) {
            console.log(`error: ${error}`)
            return []

        }
    }
    async updateById(id, product) {
        let index;
        console.log(id, product);
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8');
            this.fileInfo = JSON.parse(products);
            index = this.fileInfo.findIndex(item => item.id === id);
            if (index !== -1) {
                this.fileInfo[index] = { ...product, id: this.fileInfo[index].id }
                await fs.promises.writeFile(this.file, JSON.stringify(this.fileInfo), 'utf-8');
                return 'update succesfull.';
            } else {
                return { error: 'Product was not found it.' };
            }
        } catch (error) {
            return `error: ${error}.`;
        }
    }


    async save(object) {

        const products = await this.getAll()
        object.id = parseInt(object.id)
        object.price = parseInt(object.price)

        try {

            object.id = products.length === 0 ? 0 : products[products.length - 1].id + 1
            products.push(object)

            console.log(`the next element will be added : ${JSON.stringify(object)}`)

            await this.writeFile(products)

            console.log('saved succesfully')
        } catch (error) {
            console.log(`error: ${error}`)

        }
    }

    async getById(id) {
        const products = await this.getAll()
        try {

            const obj = products.find(products => products.id == id)

            return obj ? obj : null;



        } catch (error) {
            console.log(`error: ${error}`)


        }

    }

    async deleteById(id) {
        let products = await this.getAll()
        try {

            products = products.filter(products => products.id != id)

            await this.writeFile(products)
        } catch (error) {
            throw new Error(error)

        }

    }

}


module.exports = Container;

