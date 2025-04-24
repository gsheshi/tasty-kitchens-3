import {Component} from 'react'
import {RiArrowDropLeftLine, RiArrowDropRightLine} from 'react-icons/ri'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import RestaurantsHeader from '../RestaurantsHeader'

import RestaurantCard from '../RestaurantCard'

import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

class PopularRestaurants extends Component {
  state = {
    restaurantsList: [],
    isLoading: false,
    activePage: 1,
    sortOption: sortByOptions[1].value,
    totalPages: 0,
    searchInput: '',
  }

  componentDidMount() {
    this.getRestaurants()
  }

  onChangeSearchInput = searchInput => {
    this.setState({searchInput, activePage: 1}, this.getRestaurants)
  }

  scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    })
  }

  getRestaurants = async () => {
    this.setState({isLoading: true})
    const {activePage, sortOption, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const limit = 9
    const offset = (activePage - 1) * limit
    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}&sort_by_rating=${sortOption}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    const totalRestaurants = data.total
    const totalPages = Math.ceil(totalRestaurants / limit)
    const updatedData = data.restaurants.map(eachItem => ({
      id: eachItem.id,
      cuisine: eachItem.cuisine,
      imageUrl: eachItem.image_url,
      name: eachItem.name,
      rating: eachItem.user_rating.rating,
      totalReviews: eachItem.user_rating.total_reviews,
    }))
    this.setState(
      {
        restaurantsList: updatedData,
        isLoading: false,
        totalPages,
      },
      this.scrollToBottom,
    )
  }

  updateOption = option => {
    this.setState({sortOption: option}, this.getRestaurants)
  }

  decrementPage = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage - 1,
        }),
        this.getRestaurants,
      )
    }
  }

  incrementPage = () => {
    const {activePage, totalPages} = this.state
    if (activePage < totalPages) {
      this.setState(
        prevState => ({
          activePage: prevState.activePage + 1,
        }),
        this.getRestaurants,
      )
    }
  }

  renderPopularRestaurants = () => {
    const {restaurantsList, activePage, totalPages} = this.state
    const searchResults = restaurantsList
    const isTrue = searchResults.length > 0
    return (
      <div className="popular-restaurants">
        <hr className="hr-line" />

        <hr className="hr-line" />
        {isTrue ? (
          <ul className="restaurants-list">
            {searchResults.map(eachItem => (
              <RestaurantCard restaurant={eachItem} key={eachItem.id} />
            ))}
          </ul>
        ) : (
          <div className="no-restaurants">
            <h1 className="no-restaurants-heading">No Restaurants Found</h1>
          </div>
        )}
        <div className="pagination-container">
          <button
            type="button"
            className="pagination-button"
            onClick={this.decrementPage}
          >
            <RiArrowDropLeftLine size={20} color="red" />
          </button>
          <p className="page-count">{activePage}</p>
          <span
            className="page-count"
            style={{marginLeft: '5px', marginRight: '5px'}}
          >
            of
          </span>
          <p className="page-count"> {totalPages}</p>
          <button
            type="button"
            className="pagination-button"
            onClick={this.incrementPage}
          >
            <RiArrowDropRightLine size={20} color="red" />
          </button>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="carousel-loader">
      <Loader type="ThreeDots" color="#F7931E" height={50} width={50} />
    </div>
  )

  render() {
    const {isLoading, sortOption, searchInput} = this.state

    return (
      <>
        <RestaurantsHeader
          sortOption={sortOption}
          sortByOptions={sortByOptions}
          updateOption={this.updateOption}
          searchInput={searchInput}
          updateSearchInput={this.onChangeSearchInput}
        />
        {isLoading ? this.renderLoader() : this.renderPopularRestaurants()}
      </>
    )
  }
}

export default PopularRestaurants
