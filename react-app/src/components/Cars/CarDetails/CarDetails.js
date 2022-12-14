import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { getAllCarsThunk, saveCarThunk, unsaveCarThunk } from "../../../store/cars";
import { getUserThunk } from "../../../store/session";
import Calculator from "../../Widgets/Calculator";
import ContactSeller from "../../Widgets/ContactSeller";
import "./CarDetails.css";

const CarDetails = () => {
  const { carId } = useParams();
  const carsArray = useSelector(state => Object.values(state.cars));
  const car = carsArray.find(car => car.id === +carId);
  const sessionUser = useSelector(state => state.session.user);
  const carReviews = car?.reviews.slice(0, 3);

  let isSaved = car?.carSavedCars?.some(user => user.id === +sessionUser.id);

  const dispatch = useDispatch();
  const history = useHistory();

  const [detailsPreviewImage, setDetailsPreviewImage] = useState(car?.images.length > 0 ? car.images[0].imageUrl : 'https://ridesappbucket.s3.amazonaws.com/awaiting_car.png')

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getUserThunk(sessionUser.id));
      dispatch(getAllCarsThunk())
        .then(() => {
          if (car?.images.length > 0) {
            setDetailsPreviewImage(car.images[0].imageUrl)
          }
        });
    }, 75)

    return () => {
      clearTimeout(timer);
    }
  }, [dispatch, car?.images.length, sessionUser.id, car?.carSavedCars.length])

  const saveComponentFunc = async () => {
    dispatch(saveCarThunk(carId))
  }

  const unsaveComponentFunc = async () => {
    dispatch(unsaveCarThunk(carId))
  }

  if (!sessionUser) return <>Session User Not Loaded</>
  if (!car) return <>Could not find car with this ID</>

  return (
    <div id="car-details-page-overall-container">
      <div id="car-details-page-second-container">
        <div id="car-details-page-grid">
          <div id="car-details-page-left-side-container">
            <div id="car-details-page-images-container">
              <div id="car-details-page-preview-image-container">
                <div id="car-details-page-preview-image-wrapper">
                  <img id="car-details-page-preview-image" src={detailsPreviewImage} alt="preview" onError={e => { e.currentTarget.src = 'https://ridesappbucket.s3.amazonaws.com/select_car.png'; }} />
                </div>
              </div>
              <div id="car-details-page-images-scroller-container">
                {car.images.map((image, index) => {
                  return (
                    <div id="car-details-page-small-images-wrapper" key={index}>
                      <img id="car-details-page-small-images" src={image.imageUrl} alt="small" onClick={() => setDetailsPreviewImage(image.imageUrl)} onError={e => { e.currentTarget.src = 'https://ridesappbucket.s3.amazonaws.com/select_car.png'; }} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div id="car-details-page-details-container">
              <div id="car-details-page-used-save-container">
                <div id="car-details-page-used-info">{car.new ? 'New' : 'Used'}</div>
                {!isSaved && <div id="car-details-page-unsaved-component" onClick={() => saveComponentFunc()}>Click Here to Save this Car</div>}
                {isSaved && <div id="car-details-page-saved-component" onClick={() => unsaveComponentFunc()}>Click Here to Unsave this Car</div>}
              </div>
              <div id="car-details-page-year-make-model-trim">{car.year} {car.make} {car.model} {car.trim}</div>
              <div id="car-details-page-milage">{car.miles.toLocaleString()} mi.</div>
              <div id="car-details-page-price">${car.price.toLocaleString()}</div>
              {car.price < 25000 && <div id="car-details-page-great-deal"><i class="fa-solid fa-arrow-up"></i> Great Deal!</div>}
              {car.price < 50000 && car.price >= 25000 && <div id="car-details-page-good-deal"><i class="fa-solid fa-arrow-trend-up"></i> Good Deal</div>}
              {car.price >= 50000 && <div id="car-details-page-fair-deal"><i class="fa-solid fa-arrow-right"></i> Fair Deal</div>}
            </div>
            <div id="car-details-page-basics-container">
              <div id="car-details-page-basics-title">Basics</div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-exColor">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-exColor-title">Exterior Color</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-exColor-info">{car.exColor}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-inColor">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-inColor-title">Interior Color</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-inColor-info">{car.inColor}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-drivetrain">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-drivetrain-title">Drivetrain</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-drivetrain-info">{car.drivetrain}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-mpg">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-mpg-title">MPG</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-mpg-info">{car.mpg}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-fuelType">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-fuelType-title">Fuel Type</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-fuelType-info">{car.fuelType}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-transmission">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-transmission-title">Transmission</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-transmission-info">{car.transmission}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-engine">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-engine-title">Engine</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-engine-info">{car.engine}</div>
              </div>
              <div className="car-details-page-basics-grids" id="car-details-page-basics-mileage">
                <div className="car-details-page-basics-titles-class" id="car-details-page-basics-mileage-title">Mileage</div>
                <div className="car-details-page-basics-info-class" id="car-details-page-basics-mileage-info">{car.miles.toLocaleString()} mi.</div>
              </div>
            </div>
            <div id="car-details-page-reviews-title">Consumer Reviews</div>
            {carReviews.map((review, index) => {
              return (
                <div id="reviews-page-single-review-container" key={index}>
                  <div id="reviews-page-single-star-ratings-container">
                    <div id="reviews-page-single-star-ratings-number-stars-container">
                      <div id="reviews-page-single-star-ratings-number">{review.rating.toFixed(1)}</div>
                      <div id="reviews-page-single-star-ratings-stars-container">
                        <div id="reviews-page-single-star-ratings-first-star">
                          {review.rating < 0.25 && <i class="fa-regular fa-star"></i>}
                          {review.rating >= 0.25 && review.rating < 0.75 && <i class="fa-solid fa-star-half-stroke"></i>}
                          {review.rating >= 0.75 && <i class="fa-solid fa-star"></i>}
                        </div>
                        <div id="reviews-page-single-star-ratings-second-star">
                          {review.rating < 1.25 && <i class="fa-regular fa-star"></i>}
                          {review.rating >= 1.25 && review.rating < 1.75 && <i class="fa-solid fa-star-half-stroke"></i>}
                          {review.rating >= 1.75 && <i class="fa-solid fa-star"></i>}
                        </div>
                        <div id="reviews-page-single-star-ratings-third-star">
                          {review.rating < 2.25 && <i class="fa-regular fa-star"></i>}
                          {review.rating >= 2.25 && review.rating < 2.75 && <i class="fa-solid fa-star-half-stroke"></i>}
                          {review.rating >= 2.75 && <i class="fa-solid fa-star"></i>}
                        </div>
                        <div id="reviews-page-single-star-ratings-fourth-star">
                          {review.rating < 3.25 && <i class="fa-regular fa-star"></i>}
                          {review.rating >= 3.25 && review.rating < 3.75 && <i class="fa-solid fa-star-half-stroke"></i>}
                          {review.rating >= 3.75 && <i class="fa-solid fa-star"></i>}
                        </div>
                        <div id="reviews-page-single-star-ratings-fifth-star">
                          {review.rating < 4.25 && <i class="fa-regular fa-star"></i>}
                          {review.rating >= 4.25 && review.rating < 4.75 && <i class="fa-solid fa-star-half-stroke"></i>}
                          {review.rating >= 4.75 && <i class="fa-solid fa-star"></i>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="reviews-page-single-review-date">{review.createdAt.split(', ')[1].slice(0, 11)}</div>
                  <div id="reviews-page-single-review-user-information">By {review.user.firstName} {review.user.lastName}</div>
                  <div id="reviews-page-single-review-content">{review.content}</div>
                </div>
              )
            })}
            {car.reviews.length < 1 && <NavLink id="car-details-page-see-all-reviews-navlink" to={`/cars/${car.id}/reviews`}>Be the first to leave a consumer review</NavLink>}
            {car.reviews.length > 0 && <NavLink id="car-details-page-see-all-reviews-navlink" to={`/cars/${car.id}/reviews`}>See all {car.reviews.length} consumer reviews</NavLink>}
          </div>
          <div id="car-details-page-right-side-container">
            <div id="car-details-page-go-back-button" onClick={() => history.go(-1)}>Go back</div>
            {sessionUser.id !== car.sellerId && <ContactSeller car={car} />}
            {sessionUser.id !== car.sellerId && <Calculator car={car} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
