import React from 'react';

// import { ConfigProvider as AntDesignProvider } from 'antd';
// import { Provider as ReduxProvider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';

import Mapa from './domains/mapas';
// import store from './redux/store';
// import AntDesignLocale from './resources/locale';
// import RouteManager from './routes';

function App() {
  return <Mapa />;
  // return (
  //   <AntDesignProvider locale={AntDesignLocale}>
  //     <BrowserRouter>
  //       <ReduxProvider store={store}>
  //         <RouteManager />
  //       </ReduxProvider>
  //     </BrowserRouter>
  //   </AntDesignProvider>
  // );
}

export default App;
