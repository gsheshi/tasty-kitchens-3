import {Route, Switch, Redirect} from 'react-router-dom'

import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import RestaurantDetails from './components/RestaurantDetails'
import NotFound from './components/NotFound'
import Cart from './components/Cart'
import {CartContextProvider} from './context/CartContext'

import './App.css'

export default () => (
  <CartContextProvider>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute
        exact
        path="/restaurant/:id"
        component={RestaurantDetails}
      />
      <ProtectedRoute exact path="/cart" component={Cart} />
      <Route path="/bad-path" component={NotFound} />
      <Redirect to="bad-path" />
    </Switch>
  </CartContextProvider>
)
