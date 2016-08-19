import _ from 'lodash'
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Loading from 'react-loading';

export default class Downloads extends Component{
	constructor(props) {
    super(props);
    this.state = {
      files: [],
      displayed_files: [],
      searchText: ''
    };
  }

	componentWillMount(){
		this.getFiles();
  }

	getFiles = () =>{   
    // ajax request to load files from DropBox API
    // changed for WordPress

		var objects = [];
    var dropBoxResponse;

    jQuery.ajax({
      type: "POST",
      url: downloads.url, 
      data: { action: "my_ajax_endpoint" }, 
      success: function(response){ 
        dropBoxResponse = JSON.parse(response.substring(0,response.length-1));
        dropBoxResponse.entries.map(function(item){  
           paths[item.name] = item.path_display;
           objects.push(item.name);            
        })    
        this.setState({
          files: objects,
          displayed_files: objects
        }); 
      },
      error: function(MLHttpRequest, textStatus, errorThrown){  
         alert("There was an error: " + errorThrown);  
      },
      timeout: 60000
    });  
	}

	downloadsSearch = (value) => {
    if (value == ""){
      this.setState({
        displayed_files: this.state.files
      })
      return;
    }

    var v = value.toLowerCase(),
        i;
    var displayed_files = [];

    this.state.files.map(function(item){
      i = item.toLowerCase(); 
      if (i.search(v) > -1 )
        displayed_files.push(item);
    });      
    this.setState({
      displayed_files: displayed_files
    });
	}

	render(){

    const downloadsSearch = _.debounce((value) => {this.downloadsSearch(value)}, 300)
		
    var filetype;
		const files = this.state.displayed_files.map(function(item, index){
      filetype = item.split(".");
      filetype = filetype[filetype.length-1];
			return 	<tr key={index}>						
    						<td width="15%" className = {"icon " + filetype} ></td>
    						<td width="85%">{item}</td>
    					</tr>
		});

    var input;
    input = <input  type="text" className="form-control" id="downloads-search" onChange = { event => { downloadsSearch(event.target.value)} }  />
    
    if(this.state.displayed_files.length < 1){
      return(
        <div>
          {input}          
          <div className = "loading"> <Loading type='spokes' color='#0057a0' /></div>
        </div>
      )
    };
    
		return(
			<div>
				{input}
        <div className="scrollable-table">
          <table className="table-downloads">
           	<tbody>
          		{files}
          	</tbody>
      	  </table>
        </div>
      </div>
		)
	}
}

ReactDOM.render(<Downloads />, document.querySelector('.row'));