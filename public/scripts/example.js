/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
        <span className="commentBody" dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data,
          commentsCount: data.length
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCommentSubmit: function(comment) {
    // var comments = this.state.data;
    // var newComments = comments.concat([comment]);
    // this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({
          data: data,
          commentsCount: data.length
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  removeCommentBox: function(){
    ReactDOM.unmountComponentAtNode(document.getElementById('content'));
  },

  getInitialState: function() {
    return {
      data: [],
      headerText: null
    };
  },

  componentWillMount:function(){
    this.setState({ headerText: 'Latest Comments' });
  },

  componentDidMount: function() {
    // Load comments from comments.json
    this.loadCommentsFromServer();
    // Update comments every 5 seconds
    this.refreshIntervalId = setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  shouldComponentUpdate:function(nextProps, nextState){
    return true;
  },

  componentWillUnmount: function() {
    clearInterval(this.refreshIntervalId);
  },

  render: function() {
    return (
      <div className="commentBox">
        <h1>{this.state.headerText}</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        <span className="remove" onClick={this.removeCommentBox}>Remove Comment Box</span>
      </div>
    );
  }
});

var CommentList = React.createClass({
  getDefaultProps: function() {
    console.log("inside CommentList getDefaultProps method");
  },

  getInitialState: function() {
    console.log("inside CommentList getInitialState method");
    return null;
  },

  componentWillMount:function(){
    console.log("inside CommentList componentWillMount method");
  },

  componentDidMount: function() {
    console.log("inside CommentList componentDidMount method");
    console.log("-------------------------------------------");
  },

  componentWillReceiveProps: function(nextProps) {
    console.log("inside CommentList componentWillReceiveProps method");
  },

  shouldComponentUpdate:function(nextProps, nextState){
    console.log("inside CommentList shouldComponentUpdate method");
    return true;
  },

  componentWillUpdate:function(){
    console.log("inside CommentList componentWillUpdate method");
  },

  componentDidUpdate:function(){
    console.log("inside CommentList componentDidUpdate method");
    console.log("--------------------------------------------");
  },

  componentWillUnmount: function() {
    console.log("inside CommentList componentWillUnmount method");
  },

  render: function() {
    console.log("inside CommentList render method");
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
  },

  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <h3>Post a Comment</h3>
        <input className="commentName" type="text" placeholder="Your name" ref="author" />
        <textarea className="commentText" placeholder="Say something..." ref="text" rows="4" cols="65"></textarea>
        <input className="submitButton" type="submit" value="POST" />
      </form>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={10000} />,
  document.getElementById('content')
);
