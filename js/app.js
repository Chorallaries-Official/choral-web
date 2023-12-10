jQuery = require('jquery');
require('bootstrap');
var validator = require('bootstrap-validator');
var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
var dateFormat = require('dateformat');

var selectedTime = null;

function timeExists(time, data) {
    for (var i=0; i < data.length; i++) {
        var startTime = new Date(data[i].timeslot);
        console.log(startTime);
        if (startTime.getTime() == time.getTime()) return true;
    }

    return false;
}

function convertDate(datestr) {
    var timeDiff = -5;
    var date = new Date(datestr);
    var h = (date.getUTCHours() + timeDiff + 24) % 24;
    var m = date.getUTCMinutes();
    if (parseInt(m).toString().length < 2) m = "0" + m;
    return h + ":" + m;
}

function convertDateForAjax(date, offset) {
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    var datestr = dateFormat(nd, "yyyy-mm-dd HH:MM:ss");
    return datestr;
}


function convertoToJsonObj(serializedArray) {
    var obj = {};
    for (var i=0; i < serializedArray.length; i++) {
        obj[serializedArray[i].name] = serializedArray[i].value;
    }
    console.log(obj);

    return obj;
}




var ScheduleTable = React.createClass({

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        jQuery.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                // Fill data with dates, check whether each date is occupied
                var startTime = new Date("05 Feb 2016 19:00:00 GMT-0500");
                var endTime = new Date("05 Feb 2016 22:00:00 GMT-0500");
                //console.log(startTime);
                //console.log(endTime);

                var tableData = [];
                console.log(data);

                while (startTime <= endTime) {
                    tableData.push({time: startTime, exists: timeExists(startTime, data),
                        millis: startTime.getTime().toString(), selected: false});
                    var dateMills = startTime.getTime();
                    dateMills += 420000;
                    startTime = new Date(dateMills);
                }

                console.log(tableData);

                this.setState({data: tableData});
            }.bind(this),
            error: function(data) {
                alert("Oh no! Something went wrong :( Please email choral-info@mit.edu with your audition details and we'll fix this bug.");
                console.error(data);
            }.bind(this)
        });
    },

    handleClick: function(i, e) {

        if (!this.state.data[i].exists) {
            console.log(e);
            console.log(i);
            selectedTime = this.state.data[i].millis;
            console.log(selectedTime);

            var newState = [];
            for (var i=0; i < this.state.data.length; i++) {
                var entry = this.state.data[i];
                if (entry.millis == selectedTime) {
                    entry.selected = true;
                }
                else {
                    entry.selected = false;
                }

                newState.push(entry);
            }

            this.setState({data: newState});
        }

    },

    render: function() {
        var scheduleRows = this.state.data.map(function(row,i) {

            var classstr = "";
            if (row.selected) {
                classstr = "selected";
            }
            else {
                if (!row.exists) {
                    classstr = "selectable";
                }
                else {
                    classstr = "nonselectable";
                }
            }

            return (
                <tr id={row.millis} className={classstr} key={i} onClick={this.handleClick.bind(this, i)}>
                    <td>{convertDate(row.time.toUTCString())}</td>
                </tr>
            );
        }, this);

        return (
          <div className="scheduleTable">
            <h2 className="col-title" >Slots</h2>
            <table className="table">
                <tbody>
                    {scheduleRows}
                </tbody>
            </table>
          </div>
        );
    }
});

function renderTable() {
    ReactDOM.render(
        <ScheduleTable url="http://ckskylight.mit.edu:3000/query" />,
        document.getElementById('schedule')
    );
    console.log("rendered");
}

renderTable();


jQuery('#audform').validator().on('submit', function(e) {

    e.preventDefault();
    console.log("submit");
    var formElement = jQuery(this)[0];
    var json = convertoToJsonObj(jQuery(this).serializeArray());

    if (selectedTime == null) {
        alert("Please select an audition time");
        return;
    }

    var date = new Date(parseInt(selectedTime));
    var datestr = convertDateForAjax(date, -5);
    json["time"] = datestr;

    var confirmstr = "You're signing up for an audition slot on " +
                    datestr +
                    " with kerberos " +
                    json.kerberos +
                    ". Proceed?";

    var conf = confirm(confirmstr);

    if (conf) {
        jQuery.ajax({
            url : "http://ckskylight.mit.edu:3000/update",
            type: "POST",
            data: JSON.stringify(json),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                alert("Awesome! You're all set. See you at auditions :)");
                location.reload();
            },
            error: function (jXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                alert("Oh no! Something went wrong :( Please email choral-info@mit.edu with your audition details and we'll fix this bug.");
            }
        });
    }
});


function getTimes() {
    jQuery.get("http://ckskylight.mit.edu:3000/query", renderTimes);
}

function renderTimes(data) {
    console.log(data);

}

