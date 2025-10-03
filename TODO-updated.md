# Enhancement Plan for Search Bar and Filters on "Encontre Escolas" Page

## Current State Analysis
- Search bar UI exists but lacks functionality
- Filter panel exists but is hidden and non-functional
- Backend only supports basic pagination
- No search/filter parameter processing

## Enhancement Tasks

### 1. Frontend JavaScript Implementation
- [x] Add event listeners for search form submission
- [x] Add event listeners for filter form submission
- [x] Implement AJAX calls to backend with search/filter parameters
- [x] Add loading states and user feedback
- [x] Implement filter panel toggle functionality

### 2. Backend Controller Updates
- [x] Update `paginarEscolas` method to accept query parameters
- [x] Add parameter validation and sanitization
- [x] Implement search logic for school name, city, region
- [x] Implement filter logic for education levels, networks, shifts, etc.

### 3. Database Model Enhancements
- [x] Add `searchAndFilterSchools` method to escolaModel
- [x] Implement dynamic query building based on parameters
- [x] Add proper JOINs and WHERE clauses for filtering
- [x] Ensure efficient queries with proper indexing considerations

### 4. UI/UX Improvements
- [x] Improve search bar responsiveness and styling
- [x] Make filter panel more user-friendly
- [x] Add clear/reset filter options
- [x] Implement search suggestions or autocomplete
- [x] Add visual feedback for active filters

### 5. Testing and Validation
- [ ] Test search functionality with various inputs
- [ ] Test filter combinations
- [ ] Ensure mobile responsiveness
- [ ] Add error handling for failed requests
- [ ] Validate against edge cases (empty results, invalid inputs)

## Implementation Order
1. [x] Start with backend model enhancements (database queries)
2. [x] Update controller to process parameters
3. [x] Add frontend JavaScript for form handling
4. [x] Improve UI/UX and styling
5. [ ] Test thoroughly and add error handling

## Files Created/Modified
- [x] app/models/escolaModel.js - Added searchAndFilterSchools and countFilteredSchools methods
- [x] app/controllers/escolaController.js - Updated paginarEscolas to handle search/filter parameters
- [x] app/views/partials/search-bar-new.ejs - New functional search bar with JavaScript
- [x] app/views/partials/filtro-atualizado-new.ejs - New functional filter panel with JavaScript

## Next Steps
- Replace the old partials in the main page with the new functional ones
- Test the functionality thoroughly
- Add any missing CSS styles if needed
- Consider adding URL parameter persistence for better UX
