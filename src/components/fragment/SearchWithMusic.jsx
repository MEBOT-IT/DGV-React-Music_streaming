import React from 'react';
import MusicApi from '../../api/MusicApi';

class SearchWithMusic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Search for Song"
          value={this.state.searchTerm}
          onChange={this.handleSearchChange}
        />

        {/* Render the MusicApi component and pass the search term as a prop */}
        <MusicApi searchTerm={this.state.searchTerm} />
      </div>
    );
  }
}

export default SearchWithMusic;
