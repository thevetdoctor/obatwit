import actions from "./actions";

export default function reducer(state= initialState, action) {
    switch(action.type) {
        case actions.setTwitData.type:

            return {
              ...state,
              twits: action.data
            }          
        case actions.setMessagesData.type:

            return {
              ...state,
              messages: action.data
            }          
        case actions.setPeopleData.type:

            return {
              ...state,
              peopleData: action.data
            }          
        case actions.setSearchData.type:

            return {
              ...state,
              searchData: action.data
            }          
        case actions.setUser.type:

            // console.log('user is set as', action.data);
            const user = action.data.user;
            const email = action.data.email;
            const userData = state.peopleData.filter(obj => obj.username === user)[0];
            const userTwits = state.twits?.filter(obj => obj.twits.username === user);

            const {followers, following} = userData; 
            const followerCount = followers?.filter(user => user.follower.isFollowed).length;
            const followingCount = following?.filter(user => user.follower.isFollowed).length;
            const isFollower = followers.filter(user => user.follower.isFollowed).filter(user => user.email === email).length > 0;
            const isFollowing = following.filter(user => user.follower.isFollowed).filter(user => user.email === email).length > 0;

            return {
              ...state,
              user, userData, followers, following, followerCount, followingCount, isFollower, isFollowing, userTwits
            }          
        case actions.setUsersData.type:

            return {
              ...state,
              usersData: action.data
            }          
        case actions.setUserCount.type:

            return {
              ...state,
              users: action.data
            }          
        case actions.setFormActive.type:

            return {
              ...state,
              formActive: action.data
            }          
        case actions.setNewsType.type:
            const newsByType = state.newsData.filter(type => (type.type === action.data));

            return {
              ...state,
              newsType: action.data, news: newsByType, searchQuery: '', page: 1, totalPages: Math.ceil(newsByType.length / state.pageSize)
            }          
            case actions.setPage.type:
            return {
                ...state,
                page: action.data
            }                   
            case actions.setTotalPages.type:
            return {
                ...state,
                totalPages: action.data
            }                   
            case actions.setSearchQuery.type:
                let newsBySearch;
                if(state.newsType === 'Filter By Type') {
                    if(action.data === '') {
                        newsBySearch = state.newsData;
                    } else {
                        newsBySearch = state.newsData.filter(item => {
                            return item?.text?.toLowerCase().indexOf(action.data.toLowerCase()) >= 0;
                        });
                    }
                } else {
                    newsBySearch = state.newsData.filter(item => (item?.text?.toLowerCase().indexOf(action.data.toLowerCase()) >= 0) && (item.type === state.newsType));
                }
                    
                return {
                    ...state,
                    searchQuery: action.data, news: newsBySearch, page: 1, totalPages: Math.ceil(newsBySearch.length / state.pageSize)
                }                   
            case actions.setNetworkStatus.type:
                
            return {
                ...state,
                networkStatus: action.data
            }                   
            case actions.deleteTwit.type:
                const twitIndex = state.twits.findIndex(twit => twit.id === action.data);
                const leftOvertwits = [...state.twits];
                leftOvertwits.splice(twitIndex, 1);
                console.log(twitIndex, leftOvertwits);
                
            return {
                ...state,
                twits: leftOvertwits
            }                   
            default:
                return state;
    }
};
 
export const initialState = {
    twits: [],
    messages: [],
    users: 0,
    peopleData: JSON.parse(localStorage.getItem('peopleData')) || [],
    searchData: [],
    usersData: [],
    searchQuery: '',
    networkStatus: false,
    formActive: false,
    user: '',
    followers: [], 
    following: [], 
    followerCount: 0, 
    followingCount: 0, 
    userTwits: [],
    isFollower: false
};
