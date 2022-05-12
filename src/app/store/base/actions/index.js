import tableOptions from './table-options';
import deleteMany from './delete-many'
import filterCol from './filter-col'
import getDefinitions from './get-definitions'
import goToPage from './go-to-page'
import hideArchived from './hide-archived'
import loadColumns from './load-columns'
import loadState from './load-state'
import loadWorkflows from './load-workflows'
import resetState from './reset-state';
import resetSort from './reset-sort'
import restoreMany from './restore-many'
import saveState from './save-state'
import setPageSize from './set-page-size'
import showArchived from './show-archived'
import toggleSort from './toggle-sort'
import toggleRowSelection from './toggle-row-selection'
import archiveMany from './archive-many';
import clicked from './clicked';
import clickedMainRow from './clicked-main-row';
import clearSelection from './clear-selection';
import clearFilters from './clear-filters';
import getData from './get-data';
import loadPreset from './load-preset';
import savePreset from './save-preset';
import publishHighlightActions from './publish-highlight-actions';
import clickedRow from './clicked-row';
import removeFilter from './remove-filter';
import searchKeyword from './search-keyword';
import copiedTextToClipboard from './copied-text-to-clipboard';


export default {
    copiedTextToClipboard,
    tableOptions,
    archiveMany,
    clicked,
    clickedMainRow,
    clearFilters,
    clearSelection,
    deleteMany,
    filterCol,
    getData,
    getDefinitions,
    goToPage,
    hideArchived,
    loadColumns,
    loadPreset,
    loadState,
    loadWorkflows,
    removeFilter,
    resetState,
    resetSort,
    restoreMany,
    savePreset,
    saveState,
    searchKeyword,
    setPageSize,
    showArchived,
    toggleSort,
    toggleRowSelection,
    publishHighlightActions,
    clickedRow
}
