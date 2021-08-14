import { AsyncStorage } from "react-native";

const utils = {
    collections: {
        initCollection: async () => {
            const collections = await utils.collections.retrieveSavedCollections();

            if(!collections || collections.length <= 0) {
                utils.collections.saveCollection([], 'Default')
            }
        },
        saveCollection: async (collection, title) => {
            const collections = await utils.collections.retrieveSavedCollections() || [];

            collections.push({
                id: collections.length + 1,
                title,
                collection,
            });
        
            await AsyncStorage.setItem('chord_collections', JSON.stringify(collections));
        },
        retrieveSavedCollections: async () => {
            const collections = await AsyncStorage.getItem('chord_collections');
        
            return JSON.parse(collections)
        },
        updateCollection: async (id, notes) => {
            let collections = await utils.collections.retrieveSavedCollections();

            const exists = collections.find(collection => collection.id == id);

            console.log(exists)

            if(exists) {
                collections = collections.map(collection => {
                    if(collection.id == id) {
                        collection.collection = notes;
                    }
                })
                
                await AsyncStorage.setItem('chord_collections', JSON.stringify(collections));
            }
        }
    }
}

export default utils;