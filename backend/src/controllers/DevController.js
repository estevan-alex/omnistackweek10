const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index, show, store, update, destroy

module.exports = {
    async index (request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store (request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne( { github_username } );

        if (!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            let { name, avatar_url, bio } = apiResponse.data;
        
            if (!name){
                name = apiResponse.data.login;
            }
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        
            console.log(dev);
        }
        
        return response.json(dev);
    },

    async update(request, response){
        const { github_username, name, bio, techs } = request.body;
        console.log(request.body);

        let dev = await Dev.findOne( { github_username } );
        console.log(dev);

        let devUpdate = await dev.update({
            name: request.body.name,
            bio: request.body.bio,
            techs: parseStringAsArray(request.body.techs)
        });

        if (!request.body.name)
        {
            devUpdate = await dev.update({
                name: github_username
            });
        }

        //dev = await Dev.findOne( { github_username } );

        return response.json(dev);
    }
};