import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getAllCarsThunk } from "../../store/cars";
import { getUserThunk } from "../../store/session";
import { updateReviewThunk } from "../../store/reviews";
import "./UpdateReviewsForm.css";

const UpdateReviewsForm = () => {
  const { carId, reviewId } = useParams();
  const carsArray = useSelector(state => Object.values(state.cars));
  const car = carsArray.find(car => car.id === +carId);
  const sessionUser = useSelector(state => state.session.user);
  const reviewToUpdate = car?.reviews.find(review => review.id === +reviewId)

  const dispatch = useDispatch();
  const history = useHistory();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [forceRender, setForceRender] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getUserThunk(sessionUser.id));
      dispatch(getAllCarsThunk());
      if (reviewToUpdate) {
        setRating(+(reviewToUpdate.rating))
        setContent(reviewToUpdate.content)
      } else {
        setForceRender(!forceRender)
      }
    }, 100)
    return () => clearTimeout(timer);
  }, [dispatch, sessionUser.id, forceRender])


  if (!sessionUser) return <>Session User Not Loaded</>
  if (!car) return <>Could not find car with this ID</>

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorsArray = []

    if (rating < 1 || rating > 5) errorsArray.push('You must select a star rating between 1-5.');
    if (content.length < 10 || content.length > 250) errorsArray.push('Your review must be between 10 and 250 characters.');


    if (errorsArray.length > 0) {
      alert('Could not update review.  Please see error messages above.')
      setErrors(errorsArray);
      return
    }

    let updatedReview = {
      rating,
      content
    }

    await dispatch(updateReviewThunk(reviewId, updatedReview))

    // alert('Review successfully updated!')
    history.push(`/cars/${carId}/reviews`);
  };

  return (
    <div id="reviews-form-overall-container">
      <div id="reviews-form-second-container">
        <div id="reviews-form-welcome-big-text">Edit your review of the {car.year} {car.make} {car.model}</div>
        <div id="reviews-form-welcome-small-text">All fields are required. <span id="update-reviews-form-go-back" onClick={() => history.push(`/cars/${carId}/reviews`)}>Click here</span> if you changed your mind and want to go back.</div>
        <div id="reviews-form-overall-star-ratings-container">
          <div id="reviews-form-overall-star-ratings-text">Your overall rating</div>
          <div id="reviews-form-overall-star-ratings-stars-container">
            {rating < 1 && <div id="reviews-form-overall-star-ratings-first-star" className="reviews-form-single-star-class-unfilled" onClick={() => setRating(1)}><i class="fa-regular fa-star"></i></div>}
            {rating >= 1 && <div id="reviews-form-overall-star-ratings-first-star" className="reviews-form-single-star-class-filled" onClick={() => setRating(1)}><i class="fa-solid fa-star"></i></div>}
            {rating < 2 && <div id="reviews-form-overall-star-ratings-second-star" className="reviews-form-single-star-class-unfilled" onClick={() => setRating(2)}><i class="fa-regular fa-star"></i></div>}
            {rating >= 2 && <div id="reviews-form-overall-star-ratings-second-star" className="reviews-form-single-star-class-filled" onClick={() => setRating(2)}><i class="fa-solid fa-star"></i></div>}
            {rating < 3 && <div id="reviews-form-overall-star-ratings-third-star" className="reviews-form-single-star-class-unfilled" onClick={() => setRating(3)}><i class="fa-regular fa-star"></i></div>}
            {rating >= 3 && <div id="reviews-form-overall-star-ratings-third-star" className="reviews-form-single-star-class-filled" onClick={() => setRating(3)}><i class="fa-solid fa-star"></i></div>}
            {rating < 4 && <div id="reviews-form-overall-star-ratings-fourth-star" className="reviews-form-single-star-class-unfilled" onClick={() => setRating(4)}><i class="fa-regular fa-star"></i></div>}
            {rating >= 4 && <div id="reviews-form-overall-star-ratings-fourth-star" className="reviews-form-single-star-class-filled" onClick={() => setRating(4)}><i class="fa-solid fa-star"></i></div>}
            {rating < 5 && <div id="reviews-form-overall-star-ratings-fifth-star" className="reviews-form-single-star-class-unfilled" onClick={() => setRating(5)}><i class="fa-regular fa-star"></i></div>}
            {rating >= 5 && <div id="reviews-form-overall-star-ratings-fifth-star" className="reviews-form-single-star-class-filled" onClick={() => setRating(5)}><i class="fa-solid fa-star"></i></div>}
          </div>
        </div>
        <div id="reviews-form-content-container">
          <form onSubmit={handleSubmit}>
            <div id="reviews-form-errors">
              {errors.map((error, ind) => (
                <div key={ind}>{error}</div>
              ))}
            </div>
            <div>
              <div id="reviews-form-content-your-review">Your Review</div>
              <textarea
                id='reviews-form-content-textfield'
                className='reviews-form-fields-class'
                name='content'
                type='text'
                value={content}
                required
                maxLength={250}
                onChange={(e) => setContent(e.target.value)}
              />
              <span id="reviews-form-content-char-counter">{content.length}/250</span>
            </div>
            <button className='reviews-form-submit-button' type='submit'>Submit Updated Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateReviewsForm;
