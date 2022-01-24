import { AsyncStorage } from "react-native";

const utils = {
  collections: {
    initCollection: async () => {
      const collections = await utils.collections.retrieveSavedCollections();
      if (!collections || collections.length <= 0 || collections[0] == null) {
        await utils.collections.saveCollection({
          collection: [],
          title: "Default",
        });
      }
    },
    saveCollection: async (collection) => {
      const collectionsJSON =
        await utils.collections.retrieveSavedCollections();
      const collections = JSON.parse(collectionsJSON) || []; // in case the collectionsJSON is empty, assumes a empty array
      collections.push({
        id: collections.length + 1,
        ...collection,
      });
      await AsyncStorage.setItem(
        "chord_collections",
        JSON.stringify(collections)
      );
    },
    retrieveSavedCollections: async () => {
      try {
        const collectionsJSON = await AsyncStorage.getItem("chord_collections");
        const collections = JSON.parse(collectionsJSON);
        return collections;
      } catch (err) {
        return err;
      }
    },
    updateCollection: async (id, notes) => {
      let collections = await utils.collections.retrieveSavedCollections();
      const exists = collections.find((collection) => collection.id == id);
      if (exists) {
        collections = collections.map((collection) => {
          if (collection.id == id) {
            collection.collection = notes;
          }
        });
        await AsyncStorage.setItem(
          "chord_collections",
          JSON.stringify(collections)
        );
        return collections;
      }
    },
    insertToCollection: async (id, notes) => {
      let collections = await utils.collections.retrieveSavedCollections();
      const selectedCollection = collections.find(
        (collection) => collection.id == id
      );
      const index = collections.indexOf(selectedCollection);

      if (selectedCollection) {
        collections[index].collection = notes;
        await AsyncStorage.setItem(
          "chord_collections",
          JSON.stringify(collections)
        );
        return collections;
      }
    },
  },
};

export default utils;
