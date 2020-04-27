import React from "react";
import Loader from './Loader';
// import Editor from '../Editor/ckeditor';

//*********** IMPORT THE GLOBAL STATE */
import { GlobalContext } from "../Context/GlobalState";
import PostCard from "./PostCard";

//**************** FUNCTIONAL COMPONENT */
function Bodyposts() {
  //***************** STATE */

  const context = React.useContext(GlobalContext);

  //********* CREATE OBJECT DATA TO RENDER
  // console.log(context);
  let data = context.state.posts.map(item => (

    < PostCard
      key={item._id}
      id={item._id}
      user={item.user}
      title={item.title}
      importance={item.importance}
      createdAt={item.createdAt}
      text={item.text}
    />
  ));

  //************* PAGINATION FUNCTION */
  // Next
  const paginationNext = (page, limit) => {
    // Scroll top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    // Fetch data
    context.fetchData(page, limit)
  }

  // Prev
  const paginationPrev = (page, limit) => {
    // Scroll top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    // Fetch data
    context.fetchData(page, limit)
  }


  //************************************************** RETURN */
  return (
    <>
      <section className="sec-1">
        <div className="content alignCenter">
          {context.state.fetchError ? context.state.fetchError : null}
          {context.state.loading ? <Loader /> : data}
          <div className='info-navigation'>
            <div className="info-prev">
              {context.state.prev !== undefined ?
                <button onClick={() => paginationPrev(context.state.prev.page, context.state.prev.limit)} className='btn-prev'>Previous</button>
                : false
              }

            </div>
            <div className="info-next">
              {context.state.next !== undefined ?
                <button onClick={() => paginationNext(context.state.next.page, context.state.next.limit)} className='btn-next'>Next</button>
                :
                false
              }

            </div>
          </div>
        </div>
      </section>

      {/* follow me template */}

      <div className="made-with-love">

        Made with big
  <i className='i-love'> ♥ </i> by
  <a className='a-love' target="_blank" rel="noopener noreferrer" href="mailto:alessandro.carta@gmail.com"> @alex Paper</a>
      </div>

    </>
  );
}

export default React.memo(Bodyposts);
