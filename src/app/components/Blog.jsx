import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import { grey400, grey800, darkBlack, lightBlack } from 'material-ui/styles/colors';
import SvgCamera from 'material-ui/svg-icons/image/photo-camera';
import { List, ListItem } from 'material-ui/List';

// - Import app components
import Post from 'Post';
import PostWrite from 'PostWrite';
import UserAvatar from 'UserAvatar';

// - Import API
import * as AuthAPI from 'AuthAPI';
import * as PostAPI from 'PostAPI';

// - Import actions
import * as globalActions from 'globalActions';

export class Blog extends Component {
    /**
     * Component constructor
     * @param  {object} props is an object properties of component
     */
    constructor(props) {
        super(props)

        this.state = {
            // It's true if we want to have two column of posts.
            divided: false,
            
            // If it's true comment will be disabled on post.
            disableComments: this.props.disableComments,

            // If it's true share will be disabled on post.
            disableSharing: this.props.disableSharing,

            // If it's true, post write will be open.
            openPostWrite: false,

            // The title of home header.
            homeTitle: ''
        }

        // Binding functions to `this`
        this.postLoad = this.postLoad.bind(this);
    }

    /**
     * Open post write
     * 
     * 
     * @memberof Blog
     */
    handleOpenPostWrite = () => {
        this.setState({ openPostWrite: true });
    }

    /**
     * Close post write
     * 
     * 
     * @memberof Blog
     */
    handleClosePostWrite = () => {
        this.setState({ openPostWrite: false });
    }

    /**
     * Create a list of posts
     * @return {DOM} posts
     */
    postLoad = () => {
        let { posts, match } = this.props;
        let { tag } = match.params;

        if (posts === undefined || !Object.keys(posts).length > 0) {

            return (

                <h1>
                    'Nothing has shared.'
                </h1>

            )
        }

        else {
            var postBack = { oddPostList: [], evenPostList: [] };
            var parsedPosts = [];

            Object.keys(posts).forEach((postId) => {
                if (tag) {
                    let regex = new RegExp("#" + tag, 'g')
                    let postMatch = posts[postId].body.match(regex)
                    if (postMatch !== null)
                        parsedPosts.push({ ...posts[postId] })
                } else {
                    parsedPosts.push({ ...posts[postId] })

                }
            })

            const sortedPosts = PostAPI.sortObjectsDate(parsedPosts)
            if (sortedPosts.length > 6) {
                postBack.divided = true

            } else {
                postBack.divided = false
            }
            sortedPosts.forEach((post, index) => {

                var newPost = (
                    <div key={post.id}>

                        {index > 1 || (!postBack.divided && index > 0) ? <div style={{ height: "16px" }}></div> : ''}
                        <Post
                            body={post.body}
                            commentCounter={post.commentCounter}
                            creationDate={post.creationDate}
                            id={post.id}
                            image={post.image}
                            lastEditDate={post.lastEditDate}
                            ownerDisplayName={post.ownerDisplayName}
                            ownerUserId={post.ownerUserId}
                            ownerAvatar={post.ownerAvatar}
                            postTypeId={post.postTypeId}
                            score={post.score}
                            tags={post.tags}
                            video={post.video}
                            disableComments={post.disableComments}
                            disableSharing={post.disableSharing}
                            viewCount={posts.viewCount}
                            pictureState={true} />

                    </div>
                )

                if ((index % 2) === 1 && postBack.divided) {
                    postBack.oddPostList.push(newPost)
                }
                else {
                    postBack.evenPostList.push(newPost)
                }
            })
            return postBack
        }
    }

    componentWillMount() {
        this.props.setHomeTitle();
    }

    /**
     * Reneder component DOM
     * @return {react element} return the DOM which rendered by component
     */
    render() {

        let postList = this.postLoad()

        const { tag, displayWriting, } = this.props

        return (
            <div >
                <div className='grid grid__gutters grid__1of2 grid__space-around animate-top'>
                    <div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
                        {displayWriting && !tag
                            ? (<PostWrite open={this.state.openPostWrite} onRequestClose={this.handleClosePostWrite} edit={false} >
                                <div style={{ height: "68px", width: "100%", backgroundColor: 'white', border: '1px solid #dddfe2', borderRadius: '5px' }}>
                                    <ListItem
                                        primaryText={<span style={{ color: grey400, cursor: "text" }}> What's new with you? </span>}
                                        leftAvatar={<UserAvatar fullName={this.props.fullName} fileName={this.props.avatar} size={36} />}
                                        rightIcon={
                                            <svg width="24" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M10.133 15.239H3.84L8.533 9.92l2.995 3.393 3.939-5.438 5.226 7.364h-10.56zM1.742 0h20.516c.606 0 .826.063 1.047.181.221.119.395.293.514.514.118.221.181.441.181 1.047v14.516c0 .606-.063.826-.181 1.047a1.234 1.234 0 0 1-.514.514c-.221.118-.441.181-1.047.181H1.742c-.606 0-.826-.063-1.047-.181a1.234 1.234 0 0 1-.514-.514C.063 17.084 0 16.864 0 16.258V1.742C0 1.136.063.916.181.695.3.474.474.3.695.181.916.063 1.136 0 1.742 0zm.391 2.25v13.5h19.734V2.25H2.133zM6.72 7.875c-1.084 0-1.92-.801-1.92-1.739 0-1.04.836-1.84 1.92-1.84.978 0 1.813.8 1.813 1.84 0 .938-.835 1.739-1.813 1.739z" fill="#585858"/></svg>
                                        }
                                        style={{ padding: "7px 0px", fontWeight: "200" }}
                                        onTouchTap={this.handleOpenPostWrite}
                                    />
                                </div>
                                <div style={{ height: "16px" }}></div>
                            </PostWrite>)
                            : ''}

                        {postList.evenPostList}
                        <div style={{ height: "16px" }}></div>
                    </div>
                    {postList.divided
                        ? (<div className='grid-cell animate-top' style={{ maxWidth: '530px', minWidth: '280px' }}>
                            <div className="blog__right-list">
                                {postList.oddPostList}
                                <div style={{ height: "16px" }}></div>
                            </div>
                        </div>)
                        : ''}
                </div>
            </div>
        )
    }
}


/**
 * Map dispatch to props
 * @param  {func} dispatch is the function to dispatch action to reducers
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setHomeTitle: () => dispatch(globalActions.setHeaderTitle(ownProps.homeTitle || '')),
        showTopLoading: () => dispatch(globalActions.showTopLoading()),
        hideTopLoading: () => dispatch(globalActions.hideTopLoading())

    }
}

/**
 * Map state to props
 * @param  {object} state is the obeject from redux store
 * @param  {object} ownProps is the props belong to component
 * @return {object}          props of component
 */
const mapStateToProps = (state, ownProps) => {
    return {
        avatar: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].avatar : '',
        fullName: state.user.info && state.user.info[state.authorize.uid] ? state.user.info[state.authorize.uid].fullName : ''
    }
}

// - Connect component to redux store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog))
