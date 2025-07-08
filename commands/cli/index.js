import moment from "moment";
import { createSQL } from "../sql/create.js";
import { seeds } from "../sql/seeds.js";
import { migrate, procedures, views } from "../sql/migrate.js";
import { createController } from "../controllers/index.js";
import { createModel } from "../models/index.js";
import { createRoutes } from "../routes/index.js";
import { createViews } from "../sql/create-views.js";

const commands      = process.argv
const commandLength = process.argv.length;
const dateFormat    = moment().format('DDMMYYYY_HHmmss');
const extension     = '.sql';


if (commandLength < 3) {
    console.log('Usage: node test.js <test-name>');
}


if (commandLength >= 3) {

    /**
     * Remove Directory file from array
    */
    const options = commands.slice(1, commandLength).slice(1, commands.length)

    /**
     * Remove option from array,
     * Keep on names
    */
    const sqlNames = options.slice(1, options.length)

    if ((options[0]) === '--create') {

        sqlNames.forEach( name => {
            const filename = `${name}_${dateFormat}${extension}`
            createSQL(filename, name)
        })

        new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            console.log(`\n✅🌈 You have created SQL: ${sqlNames}!\n`)
            process.exit(0)
        })
    }


    /**
     * Create Views
     */
    if ((options[0]) === '--create-views') {
        const viewNames = options.slice(1, options.length)
        if (viewNames.length > 0) {
            viewNames.forEach( name => {
                const filename = `${name}_${dateFormat}${extension}`
                createViews(filename, name, 'view')
            })

            new Promise(resolve => setTimeout(resolve, 100)).then(() => {
                console.log(`\n✅🌈 You have created Views: ${viewNames}!\n`)
                process.exit(0)
            })
        }
        else {
            console.log(`\x1b[41mview name can't be blank!!\x1b[0m\n`)
            console.log(`\x1b[33m[TRY]: \x1b[30mnpm run create:views viewname\x1b[0m\n\n`)
            process.exit(0)
        }
    }


    /**
     * Migrate Table
    */
    if ((options[0]) === '--migrate') {
        views()        // Run views first to drop them before tables
        migrate()      // Then run table migrations
        views()        // Run views again to recreate them
        procedures()   // Finally run procedures

        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            console.log(`✅🌈  Migration completed!\n`)
            process.exit(0)
        })
    }

    /**
     * Insert Seeds
    */
    if ((options[0]) === '--seeds') {
        seeds()

        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            console.log(`✅🌈  Seeds completed!\n`)
            process.exit(0)
        })
    }

    /**
     * Create Controller
    */
    if ((options[0]) === '--controller') {

        const controllerNames = options.slice(1, options.length)
        if (controllerNames.length > 0) {
            controllerNames.forEach( name => {
                const filename = `${name}`
                createController(filename)
            })

            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                console.log(`✅🌈  You have created controller file!\n`)
                process.exit(0)
            })
        }
        else {
            console.log(`\x1b[41mcontroller name can't be blank!!\x1b[0m\n`)
            console.log(`\x1b[33m[TRY]: \x1b[30mnpm run create:controller controllername\x1b[0m\n\n`)
            process.exit(0)
        }
    }


    /**
     * Create Model
    */
    if ((options[0]) === '--model') {

        const modelNames = options.slice(1, options.length)
        if (modelNames.length > 0) {
            modelNames.forEach( name => {
                const filename = `${name}`
                createModel(filename)
            })

            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                console.log(`✅🌈  You have created model file!\n`)
                process.exit(0)
            })
        }
        else {
            console.log(`\x1b[41mmodel name can't be blank!!\x1b[0m\n`)
            console.log(`\x1b[33m[TRY]: \x1b[30mnpm run create:model modelname\x1b[0m\n\n`)
            process.exit(0)
        }
    }


    /**
     * Create Route
    */
    if ((options[0]) === '--route') {

        const routeNames = options.slice(1, options.length)
        if (routeNames.length > 0) {
            routeNames.forEach( name => {
                const filename = `${name}`
                createRoutes(filename)
            })

            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                console.log(`✅🌈  You have created route file!\n`)
                process.exit(0)
            })
        }
        else {
            console.log(`\x1b[41mroute name can't be blank!!\x1b[0m\n`)
            console.log(`\x1b[33m[TRY]: \x1b[30mnpm run create:route routename\x1b[0m\n\n`)
            process.exit(0)
        }
    }

    /**
     * Create Controller, Create Route, Create Model
    */
    if ((options[0]) === '--rcm') {

        const rcmNames = options.slice(1, options.length)
        if (rcmNames.length > 0 ) {
            rcmNames.forEach( name => {
                const filename = `${name}`
                createRoutes(filename)
                createController(filename)
                createModel(filename)
            })

            new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
                console.log(`✅🌈 All file created!\n`)
                process.exit(0)
            })
        }
        else
        {
            console.log(`\x1b[41mrcm name can't be blank!!\x1b[0m\n`)
            console.log(`\x1b[33m[TRY]: \x1b[30mnpm run create:rcm rcmname\x1b[0m\n\n`)
            process.exit(0)
        }
    }
}
