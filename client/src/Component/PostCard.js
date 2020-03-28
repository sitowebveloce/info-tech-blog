import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
//*********** IMPORT THE GLOBAL STATE */
import { GlobalContext } from "../Context/GlobalState";
import { GlobalUsersContext } from '../Context/GlobalUsersMessage';

export default function PostCard(props) {
  //*********** CONTEXT */
  const context = React.useContext(GlobalContext);
  const contextUsers = React.useContext(GlobalUsersContext);
  //********* Props deconstruction
  const { id, title, importance, createdAt, text, user } = props;
  //********* STATE */
  const [showDeleteBtn, setShowDeleteBtn] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [dataUpdate, setDataUpdate] = React.useState();
  const APIURL = "http://localhost:3001";
  // Useeffect
  React.useEffect(() => {

  }, []);
  //**************************************** FUNCTIONS */
  //************************** Delete function
  const toggleDeleteDiv = id => {
    let confirm = window.confirm("Are you sure?");
    if (!confirm) {
      // If false
      return alert("Be aware.");
    }
    setShowDeleteBtn(!showDeleteBtn);

  };
  //**************** EDIT */
  const toggleEdit = id => {
    setEdit(!edit);
  };

  //********** UPDATE POST */
  const submitUpdate = (id, dataUpdate) => {
    // console.log(id);
    // console.log(dataUpdate);
    // Update DB
    context.updatePost(id, dataUpdate);
    setEdit(!edit);
  };

  // Return
  return (
    <div>
      <div key={id} className="content">
        <div className="info-card">
          <div className="info-card-title"> {title} </div>
          <div className="info-card-owner"><b>Owner</b>: {`${user.fname} ${user.lname}`} </div>
          <div className={importance === 'low' ? 'info-card-importance low' : importance === 'high' ? 'info-card-importance high' : importance === 'medium' ? 'info-card-importance  medium' : null}>
            <b>Relevance: </b> {importance}
          </div>
          <div className="info-card-time">
            <b>Date: </b>

            {new Date(createdAt).toLocaleDateString("it-IT", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric"
            })}
          </div>

          <CKEditor
            editor={InlineEditor}
            data={text}
            disabled={edit ? false : true}
            onInit={editor => {
              // You can store the "editor" and use when it is needed.
              // console.log("Editor is ready!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              // console.log({ event, editor, data });
              setDataUpdate(data);
            }}
            config={{

              ckfinder: {
                uploadUrl: `/uploads`
              }
            }}
          // onBlur={(event, editor) => {
          //   console.log("Blur.", editor);
          // }}
          // onFocus={(event, editor) => {
          //   console.log("Focus.", editor);
          // }}
          />
          {title === 'Not Found' ? '' : (
            <div className='info-card-btns'>
              {showDeleteBtn ? (
                <div className={`confirm-del info-btn-del-${id}`}>
                  <button
                    onClick={() => context.deletePost(`${id}`)}
                    className="btn-del"
                  >
                    Confirm
              </button>
                </div>
              ) : (
                  <div className="confirm-del">

                    {contextUsers.state.user.email === user.email || contextUsers.state.user.role === 'admin' ?
                      <button
                        onClick={() => toggleDeleteDiv(`${id}`)}
                        className={`btn-del btn-del-btn-${id}`}
                      > Delete</button>
                      :
                      null
                    }

                  </div>
                )}
              {contextUsers.state.user.email === user.email || contextUsers.state.user.role === 'admin' ?
                <div className="info-edit">
                  <button onClick={() => toggleEdit(`${id}`)}
                    className="edit-btn">
                    Edit
            </button>
                  {edit ? (
                    <button
                      onClick={() => submitUpdate(`${id}`, { dataUpdate })}
                      className="edit-btn-update"
                    >
                      Update
                    </button>
                  ) : (
                      ""
                    )}
                </div>
                :
                null

              }

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
