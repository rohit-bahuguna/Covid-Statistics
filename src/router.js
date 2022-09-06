const express = require('express');
const router = express.Router();

// const data = require('./data')
const { connection } = require('./connector')

// router.post('/', async (req, res) => {



//        try {  

//         const response = await connection.create(data.data)
//            console.log(response)
//            res.status(200).json(response)

//        } catch (err){
//            console.log(err)
//            res.status(400).json({massage : err.massage})
//         }


// })


router.get('/', async (req, res) => {
    try {
        const response = await connection.find();
        res.status(200).json(response)

    } catch (error) {
        console.log(error);
        res.status(400).json({ massage: error.massage })
    }
})

router.get('/totalRecovered', async (req, res) => {

    try {
        const response = await connection.where('recovered').gt(0)
        let totalRecovered = 0;
        response.map((value, index) => {
            totalRecovered += value.recovered
        })

        res.status(200).json({ data: { _id: "total", recovered: totalRecovered } })
    } catch (error) {
        console.log(error)
        res.status(400).json({ massage: error.massage })
    }
})

router.get('/totalActive', async (req, res) => {

    try {
        const response = await connection.find();
        let totalActive = 0;
        response.map((value, index) => {
            let Active = value.infected - value.recovered;
            totalActive += Active;
            //  console.log(totalActive)
        })

        res.status(200).json({ data: { _id: "total", active: totalActive } })

    } catch (error) {
        console.log(error)
        res.status(400).json({ massage: error.massage })
    }
})


router.get('/totalDeath', async (req, res) => {
    try {
        const response = await connection.find();
        let totalDeath = 0;

        response.map((value, index) => {
            totalDeath += value.death;
        })

        res.status(200).json({ data: { _id: "total", death: totalDeath } })

    } catch (error) {
        console.log(error);
        res.status(400).json({ massage: error.massage })
    }
})



router.get('/hotspotStates', async (req, res) => {

    try {

        const response = await connection.find();
        let hotspotStates = []
        response.map((value, index) => {
            let rate = (value.infected - value.recovered) / value.infected
            // console.log(rate)
            let newRate = rate.toPrecision(5)
            // console.log(newRate )
            if (newRate > 0.1) {
                hotspotStates.push({ state: value.state, rate: newRate })
            }
            //{state: "Maharastra", rate: 0.17854}
        })
        res.status(200).json({ data: hotspotStates });

    } catch (error) {
        console.log(error)
        res.status(400).json({ massage: error.massage })
    }
})


router.get('/healthyStates', async (req, res) => {

    try {

        const response = await connection.find();
        let healthyStates = []
        response.map((value, index) => {
            let rate = value.death / value.infected
            // console.log(rate)
            let newRate = rate.toPrecision(5)
            // console.log(newRate )
            if (newRate < 0.005) {
                healthyStates.push({ state: value.state, mortality: newRate })
            }
            //{state: "Maharastra", rate: 0.17854}
        })
        res.status(200).json({ data: healthyStates });

    } catch (error) {
        console.log(error)
        res.status(400).json({ massage: error.massage })
    }
})


module.exports = router;