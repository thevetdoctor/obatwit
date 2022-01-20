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
            default:
                return state;
    }
};
 
export const initialState = {
    twits: [],
    messages: [],
    users: 0,
    peopleData: [],
    searchData: [],
    usersData: [],
    searchQuery: '',
    networkStatus: false
};
