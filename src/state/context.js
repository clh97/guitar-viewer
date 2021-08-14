import React from 'react';

const config = {
    selectedCollection: 0,
    setSelectedCollection: () => {},
};

const Context = React.createContext(config);

export default Context;