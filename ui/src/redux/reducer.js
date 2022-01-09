import actions from "./actions";

export default function reducer(state= initialState, action) {
    switch(action.type) {
        case actions.setTwitData.type:
            console.log('Setting twits data');

            return {
              ...state,
              twits: action.data
            }          
        case actions.setPeopleData.type:
            console.log('Setting people data');

            return {
              ...state,
              peopleData: action.data
            }          
        case actions.setSearchData.type:
            console.log('Setting search data');

            return {
              ...state,
              searchData: action.data
            }          
        case actions.setUsersData.type:
            console.log('Setting users data');

            return {
              ...state,
              usersData: action.data
            }          
        case actions.setUserCount.type:
            console.log('Setting user count');

            return {
              ...state,
              users: action.data
            }          
        case actions.setNewsType.type:
            console.log('Setting News Type');
            const newsByType = state.newsData.filter(type => (type.type === action.data));

            return {
              ...state,
              newsType: action.data, news: newsByType, searchQuery: '', page: 1, totalPages: Math.ceil(newsByType.length / state.pageSize)
            }          
            case actions.setPage.type:
                console.log('Setting page');
            return {
                ...state,
                page: action.data
            }                   
            case actions.setTotalPages.type:
            console.log('Setting totalPages');
            return {
                ...state,
                totalPages: action.data
            }                   
            case actions.setSearchQuery.type:
                console.log('Setting Search Query');
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
                console.log('Setting Network Status');
                
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
    users: 0,
    peopleData: [],
    searchData: [],
    usersData: [],
    searchQuery: '',
    networkStatus: false
};
