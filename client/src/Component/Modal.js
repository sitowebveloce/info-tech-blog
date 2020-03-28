import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
// Global Context
import { GlobalContext } from "../Context/GlobalState";

export default function Modal(props) {
  const context = React.useContext(GlobalContext);
  const APIURL = "http://localhost:3001";
  // Deconstruct
  const { openModal, openModalFunc } = props;
  // Set State
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [priority, setPriority] = React.useState("low");

  //*** ON SUBMIT FUNCTION */
  const onSubmit = e => {
    // Prevent default
    e.preventDefault();
    // Create an object
    let newPost = {
      // _id: Math.floor(Math.random() * 1000000000000000) + 'eed231',
      title: title,
      text: text,
      importance: priority
    };
    // Run function context add new post
    // console.log(newPost);
    context.addPost(newPost);
    // Clear form fields
    setTitle("");
    setText("");
    setPriority("low");
    // Close modal windows
    openModalFunc();
  };

  //************************ RETURN */
  return (
    <>
      <div
        className={
          !openModal
            ? "info-modal-window"
            : "info-modal-window info-modal-window-show"
        }
      >
        <div className="info-modal-windows-up">
          <button onClick={() => openModalFunc()} className="info-modal-close">
            X
          </button>
          {/* <div className="info-modal-title">Add Info</div> */}
          <div>
            <form onSubmit={onSubmit} className="info-modal-form">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="info-modal-input-title"
                  placeholder="Title"
                  required
                />
              </div>
              <div>
                <label htmlFor="">Post Info</label>

                <CKEditor
                  editor={InlineEditor}
                  data=""
                  onInit={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                  }}
                  required
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    // console.log({ event, editor, data });
                    // Set state
                    setText(data);

                  }}
                  // onBlur={(event, editor) => {

                  // }}
                  // onFocus={(event, editor) => {
                  //   console.log("Focus.", editor);
                  // }}
                  config={{
                    // toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'fontColor',
                    //   'fontSize'],
                    // plugin: ['highlight'],
                    // heading: {
                    //   options: [
                    //     { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    //     { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    //     { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                    //   ]
                    // },
                    ckfinder: {
                      uploadUrl: `/uploads`
                    }
                  }}
                // {
                //   removePlugins: ["Heading", "Link"]
                // },
                // {
                //   toolbar: [
                //     "heading",
                //     "|",
                //     "bold",
                //     "italic",
                //     "link",
                //     "bulletedList",
                //     "numberedList",
                //     "|",
                //     "indent",
                //     "outdent",
                //     "|",
                //     "imageUpload",
                //     "blockQuote",
                //     "insertTable",
                //     "mediaEmbed",
                //     "undo",
                //     "redo",
                //     "codeBlock",
                //     "fontBackgroundColor",
                //     "fontColor",
                //     "fontSize",
                //     "highlight",
                //     "fontFamily",
                //     "pageBreak",
                //     "specialCharacters",
                //     "todoList"
                //   ]
                // }
                />

                {/* <textarea
                  name="text"
                  id=""
                  cols="30"
                  rows="10"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="editor"
                  required
                ></textarea> */}
              </div>

              <div className="info-modal-select">
                <label htmlFor="select-importance">Importance</label>
                <select
                  name="importance"
                  value={priority}
                  required
                  onChange={e => setPriority(e.target.value)}
                  className="select-importance"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="info-modal-submit">
                <button type="submit" className="info-btn-modal-submit">
                  Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
