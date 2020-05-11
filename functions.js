function getInitialTable(){
    var str = '';
    str += '<table class="propertyTable" id="propertyTable">'
    str += '      <tbody style="border:3px solid #808080;">'
    str += '      <tr><td>******************************************</td></tr>'
    str += '      <tr><td>***&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;***</td></tr>'

    str += '          <tr>'
    str += '              <td>***&emsp; 수정하고 싶은 배너를 선택해주세요&emsp;&nbsp;&nbsp;&nbsp;&nbsp;***</td>'
    str += '          </tr>'
    str += '      <tr><td>***&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;***</td></tr>'

    str += '      <tr><td>******************************************</td></tr>'

    str += '      </tbody>'
    str += '  </table>'

    return str;
}

function setJsonContent(data){
    var str = JSON.stringify(data, null, 4)
        .replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
    document.getElementById('jsonContent').innerHTML = str;
}

function parseHTML(){
    var jsonObj = {};

    var osLength = $('#mainTable > tbody > tr > td').length;

    for ( var i =0; i< osLength; i++){ //os iterator
        var configLength = $('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr').length;

        var configJsonList = [];
        for ( var j = 0; j<configLength; j++){ //config iterator
            var startTime = $('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr:nth-child('+(j+1)+') > td > div.startTime > table > tbody > tr > td:nth-child(2)')[0].innerHTML;

            var endTime = $('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr:nth-child('+(j+1)+') > td > div.endTime > table > tbody > tr > td:nth-child(2)')[0].innerHTML;

            var slotSequence = [];

            var bannerLength = $('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr:nth-child('+(j+1)+') > td > table > tbody > tr').length;
            for ( var k = 0; k<bannerLength;k++){ // banner iterator
                var bannerContent = [];

                for( var m = 0; m<3;m++){
                    if(m === 1){
                        bannerContent.push( parseInt($('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr:nth-child('+(j+1)+') > td > table > tbody > tr:nth-child('+(k+1)+') > td:nth-child('+(m+1)+')')[0].innerHTML) );
                        
                    } else {
                        bannerContent.push( $('#mainTable > tbody > tr > td:nth-child('+(i+1)+') > table > tbody > tr:nth-child('+(j+1)+') > td > table > tbody > tr:nth-child('+(k+1)+') > td:nth-child('+(m+1)+')')[0].innerHTML );

                    }
                }

                slotSequence.push(bannerContent);
            }

            var json = {"startTime":startTime,
                        "endTime":endTime,
                        "slotSequence":slotSequence };

            configJsonList.push(json);

        }

        if(i === 0){
            jsonObj["AOS"] = configJsonList;
        } else if(i === 1){
            jsonObj["IOS"] = configJsonList;
        } else if(i === 2){
            jsonObj["WEB"] = configJsonList;
        }

    }
    

    return jsonObj;
}

function processJson(json) {
    var allTable = '';

    allTable += '<table class=mytable id=mainTable>';
    allTable += '<tbody><tr>';

    for (var key in json) {
        allTable+='<td style="border: 3px solid #00ff00; padding:15px; vertical-align:top;">';
        var tableData = createTable(key, json[key]);
        allTable += tableData;
        allTable+='</td>';
    }

    allTable += '</tr></tbody>';
    allTable += '</table>';

    return allTable;
}

function createTable(os, data) {
    var html = "";

    html += '<div class="osName" id="osName">'+os + '의 banner Config</div><br>';

    html += '<table class=sortableTable>';
    html += '<tbody class=sortableTable>';


    for (var i = 0; i < data.length; i++) {
        var configData = data[i];
        html += '<tr class=configOrder style="border:3px solid #808080 "><td>';


        html += '<div class="bannerConfigOrder" id="bannerConfigOrder">'+i + '번째 config</div><br>';
        html += '<div class="startTime"><table class=mytable><tbody><tr class="startTime"><td>startTime = </td><td>' + configData['startTime'] + '</td></tr></tbody></table></div><br>';
        html += '<div class="endTime"><table class=mytable><tbody><tr class="endTime"><td>endTime = </td><td>' + configData['endTime'] + '</td></tr></tbody></table></div><br>';

        html += 'slotSequence<br>';

        html += '<table class="table table-hover sortableTable"> <thead class="thead-dark"> <tr><th>배너명</th><th>ID</th><th>status</th></tr></thead>'
        html += '<tbody class="sortableTable ui-sortable" id="'+os+'">';

        for (var j = 0; j < configData['slotSequence'].length; j++) {
            var arr = configData['slotSequence'][j];

            html += '<tr class="slotSequence ui-sortable-handle" style>';

            for (var k = 0; k < arr.length; k++) {
                html += '<td>';
                html += arr[k];
                html += '</td>';
            }

            html += '</tr>';

        }

        html += '</tbody>';
        html += '</table>';


        html += '</tr></td>';



    }
    
    html += '</tbody>';
    html += '</table>'

    return html;
}

function validationJsonData(json){
    var returnMsg = '';


    try{
        for(var key in json){
            for(var i=0; i< json[key].length;i++){
                var errorMsgHeader = key+' / '+i+'번째 config Error => ';

                var setting = json[key][i];

                if(!setting){
                    returnMsg += errorMsgHeader+'세팅값이 존재하지 않습니다';
                    alert(returnMsg);
                    return false;
                }

                if(!setting['startTime']){
                    returnMsg += errorMsgHeader+'startTime이 존재하지 않습니다.';
                }

                if(!setting['endTime']){
                    returnMsg += errorMsgHeader+'endTime이 존재하지 않습니다.';
                }
                // console.log(errorMsgHeader,setting['startTime'],setting['endTime'],setting['startTime']>=setting['endTime']);
                if(setting['startTime']>=setting['endTime']){
                    returnMsg += errorMsgHeader+'startTime이 endTime보다 큽니다!!';
                }
                var reg = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;

                if(!reg.test(setting['startTime'])){
                    returnMsg += errorMsgHeader+'startTime 날짜 형식이 맞지 않습니다';
                }

                if(!reg.test(setting['endTime'])){
                    returnMsg += errorMsgHeader+'endTime 날짜 형식이 맞지 않습니다';
                }

                var slot = setting['slotSequence'];

                for(var j=0; j<slot.length;j++){
                    var currSlot = slot[j];
                    if(currSlot[0].indexOf('Slot') === -1){
                        if(currSlot[1] !== 0){
                            returnMsg += errorMsgHeader+' / '+JSON.stringify(currSlot)+' 이벤트 배너인데 ID값이 0 이 아닙니다!!';
                        }
                    } else {
                        if(currSlot[1] <= 0){
                            returnMsg += errorMsgHeader+' / '+JSON.stringify(currSlot)+' 슬롯 배너인데 ID값이 잘못되었습니다!!';
                        }
                    }
                }


            }
        }
    } catch(e){
        returnMsg += '검증 도중에 알 수 없는 오류가 발생했습니다.';
        alert(returnMsg);
        return false;
    }

    if(returnMsg !== ''){
        alert(returnMsg);
        return false;
    }

    return true;
}

function testFun(){
    alert('!');
}



$(document).mouseup(function(e){
    setTimeout(function(){
        var jsonObj = parseHTML();
        jsonData = jsonObj;
        setJsonContent(jsonData);
    },10);
});
$(document).click(function (event) {
    var parent = event.target.parentNode;

    if(!parent.className) return;


    if(parent.className.indexOf('osOrder')!== -1){
        return;
    }else if(parent.className.indexOf('configOrder')!== -1){
        var html = '';
        var selectedOS = parent.parentNode.parentNode.parentNode.querySelector('#osName').innerHTML;
        var selectedOrder = parent.querySelector('#bannerConfigOrder').innerHTML;


        html += '<table class="propertyTable" id="propertyTable" width=324>';
        html += '<tbody style="border:3px solid #808080;">';
        html += '<tr>';
        html += '<td align=center>config 설정</td></tr>';
        
        // html += '<tr><td align=center>선택된 config</td></tr>';
        html += '<tr><td align=center>'+selectedOS+'</td></tr>';
        html += '<tr><td align=center>'+selectedOrder+'</td></tr>';
        
        html += '<tr><td align=center>';
        // html += '<td><input type="text" id="name" value='+childList[0].textContent+'></input></td>';
        html += '<tr><td colspan=1 align=center><button style="width:80px;height:40px;margin-left:10px;margin-bottom:12px;margin-top:12px;" name="addButton" id="addButton">복제</button>';
        html += '<button style="width:80px;height:40px;margin-left:30px;margin-right:10px " name="deleteButton" id="deleteButton">제거</button></td></tr>';



        html += '</tbody>';
        html += '</table>';

        document.getElementById("property").innerHTML=html;

        if(!!clickedNode){
            if(clickedNode.className.indexOf(' btn-warning') !== -1){
                clickedNode.className = clickedNode.className.replace(' btn-warning','');
            }
        }

        clickedNode = parent;

        if(clickedNode.className.indexOf(' btn-warning') === -1){
                clickedNode.className += ' btn-warning';
        }


        $('#addButton').on('click',function(){
            if(!!clickedNode && !!clickedNode.parentNode){
                var clonedNode = clickedNode.cloneNode(true);

                if(clonedNode.className.indexOf(' btn-warning') !== -1){
                    clonedNode.className = clonedNode.className.replace(' btn-warning','');
                }

                // clonedNode.childNodes[0].textContent = $('#name')[0].value;
                // clonedNode.childNodes[1].textContent = $('#id')[0].value;
                // clonedNode.childNodes[2].textContent = $('#status')[0].value;
                var idx = Array.prototype.indexOf.call(clickedNode.parentNode.childNodes,clickedNode);

                clickedNode.parentNode.insertBefore(clonedNode, clickedNode.parentNode.childNodes[idx+1]);
                
                

                if(!!clickedNode){
                    if(clickedNode.className.indexOf(' btn-warning') !== -1){
                        clickedNode.className = clickedNode.className.replace(' btn-warning','');
                    }
                }

                clickedNode = clonedNode;

                if(clickedNode.className.indexOf(' btn-warning') === -1){
                    clickedNode.className += ' btn-warning';
                }
            }

        });

        $('#deleteButton').on('click',function(){
            if(!!clickedNode && !!clickedNode.parentNode){
                clickedNode.parentNode.removeChild(clickedNode);
            }

            document.getElementById("property").innerHTML=getInitialTable();
        });



    }else if(parent.className.indexOf('startTime')!== -1){
        
        var childList = parent.childNodes;




        var html = '';
        html += '<table class="propertyTable" id="propertyTable">';
        html += '<tbody style="border:3px solid #808080;margin-bottom:10px;">';
        html += '<tr>';
        html += '<td>startTime</td>';
        html += '<td style="position:relative;">';
        html += '<div style="position:relative;">';
        
        html += '<input type="text" id="startTime" class="form-control" value="2019-06-27"></input></div></td></tr>';


        html += '<tr><td colspan=2 align=center><button style="width:100px;height:40px;margin-top:10px;margin-bottom:10px; " name="modifyButton" id="modifyButton">수정</button></td></tr>';
        html += '</tbody>';
        html += '</table>';

        
        
        document.getElementById("property").innerHTML=html;

        $('#startTime')[0].value = childList[1].textContent;
        $('#startTime').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',

        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down",
            previous: "fa fa-chevron-left",
            next: "fa fa-chevron-right",
            today: "fa fa-clock-o",
            clear: "fa fa-trash-o"
        }
        });
        $('#modifyButton').on('click',function(){
            childList[1].textContent = $('#startTime')[0].value;
        });

        if(!!clickedNode){
            if(clickedNode.className.indexOf(' btn-warning') !== -1){
                clickedNode.className = clickedNode.className.replace(' btn-warning','');
            }
        }

        clickedNode = parent;

        if(clickedNode.className.indexOf(' btn-warning') === -1){
                clickedNode.className += ' btn-warning';
        }

    }else if(parent.className.indexOf('endTime')!== -1){
        var childList = parent.childNodes;
        
        var html = '';
        html += '<table class="propertyTable" id="propertyTable">';
        html += '<tbody style="border:3px solid #808080;margin-bottom:10px;">';
        html += '<tr>';
        html += '<td>endTime</td>';
        html += '<td style="position:relative;"><input type="text" id="endTime" class="form-control"></input></td></tr>';
        html += '<tr><td colspan=2 align=center><button style="width:100px;height:40px;margin-top:10px;margin-bottom:10px; " name="modifyButton" id="modifyButton">수정</button></td></tr>';
        html += '</tbody>';
        html += '</table>';

        
        
        document.getElementById("property").innerHTML=html;

        $('#endTime')[0].value = childList[1].textContent;
        $('#endTime').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',

        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down",
            previous: "fa fa-chevron-left",
            next: "fa fa-chevron-right",
            today: "fa fa-clock-o",
            clear: "fa fa-trash-o"
        }
        });

        $('#modifyButton').on('click',function(){
            childList[1].textContent = $('#endTime')[0].value;
        });

        if(!!clickedNode){
            if(clickedNode.className.indexOf(' btn-warning') !== -1){
                clickedNode.className = clickedNode.className.replace(' btn-warning','');
            }
        }

        clickedNode = parent;

        if(clickedNode.className.indexOf(' btn-warning') === -1){
                clickedNode.className += ' btn-warning';
        }


    }else if(parent.className.indexOf('slotSequence')!== -1){
        var childList = parent.childNodes;
        
        var html = '';
        html += '<table class="propertyTable" id="propertyTable">';
        html += '<tbody style="border:3px solid #808080;">';
        html += '<tr>';
        html += '<td>배너명</td>';
        html += '<td><input type="text" id="name" value='+childList[0].textContent+'></input></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>ID</td>';
        html += '<td><input type="text" id="id" value='+childList[1].textContent+'></input></td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td>status</td>';
        html += '<td><select name="status" id="status">';
        if(childList[2].textContent === 'coming'){
            html += '<option value="coming" selected>coming</option>';
        } else {
            html += '<option value="coming">coming</option>';
        }

        if(childList[2].textContent === 'play'){
            html += '<option value="play" selected>play</option>';
        } else {
            html += '<option value="play">play</option>';
        }
        html += '</select></td></tr>';

        html += '<tr><td colspan=2 align=center><button style="width:80px;height:40px;margin-left:10px;margin-bottom:12px;margin-top:12px;" name="addButton" id="addButton">추가</button>';
        html += '<button style="width:80px;height:40px;margin-left:30px; " name="modifyButton" id="modifyButton">수정</button>';
        html += '<button style="width:80px;height:40px;margin-left:30px;margin-right:10px; " name="deleteButton" id="deleteButton">제거</button></td></tr>';

        html += '</tbody>';
        html += '</table>';

        document.getElementById("property").innerHTML=html;

        $('#addButton').on('click',function(){
            if(!!clickedNode && !!clickedNode.parentNode){
                var clonedNode = clickedNode.cloneNode(true);

                if(clonedNode.className.indexOf(' btn-warning') !== -1){
                    clonedNode.className = clonedNode.className.replace(' btn-warning','');
                }

                clonedNode.childNodes[0].textContent = $('#name')[0].value;
                clonedNode.childNodes[1].textContent = $('#id')[0].value;
                clonedNode.childNodes[2].textContent = $('#status')[0].value;
                var idx = Array.prototype.indexOf.call(clickedNode.parentNode.childNodes,clickedNode);

                clickedNode.parentNode.insertBefore(clonedNode, clickedNode.parentNode.childNodes[idx+1]);
                
                

                if(!!clickedNode){
                    if(clickedNode.className.indexOf(' btn-warning') !== -1){
                        clickedNode.className = clickedNode.className.replace(' btn-warning','');
                    }
                }

                clickedNode = clonedNode;

                if(clickedNode.className.indexOf(' btn-warning') === -1){
                    clickedNode.className += ' btn-warning';
                }
            }

        });

        $('#modifyButton').on('click',function(){
            clickedNode.childNodes[0].textContent = $('#name')[0].value;
            clickedNode.childNodes[1].textContent = $('#id')[0].value;
            clickedNode.childNodes[2].textContent = $('#status')[0].value;
        });

        $('#deleteButton').on('click',function(){
            if(!!clickedNode && !!clickedNode.parentNode){
                clickedNode.parentNode.removeChild(clickedNode);
            }

            document.getElementById("property").innerHTML=getInitialTable();
        });

        if(!!clickedNode){
            if(clickedNode.className.indexOf(' btn-warning') !== -1){
                clickedNode.className = clickedNode.className.replace(' btn-warning','');
            }
        }

        clickedNode = parent;

        if(clickedNode.className.indexOf(' btn-warning') === -1){
                clickedNode.className += ' btn-warning';
        }
    }else {
        return;
    }
});

$(document).mouseout(function(event){
    var parent = event.target.parentNode;
    if(!parent.className) return;


    if(parent.className.indexOf('osOrder')!== -1){
        return;
    }else if(parent.className.indexOf('configOrder')!== -1){
        if(parent.className.indexOf(' btn-primary')!==-1){
            parent.className = parent.className.replace(' btn-primary','');
        }
    }else if(parent.className.indexOf('startTime')!== -1){
        
        if(parent.className.indexOf(' btn-primary')!==-1){
            parent.className = parent.className.replace(' btn-primary','');
        }

    }else if(parent.className.indexOf('endTime')!== -1){
        if(parent.className.indexOf(' btn-primary')!==-1){
            parent.className = parent.className.replace(' btn-primary','');
        }
    }else if(parent.className.indexOf('slotSequence')!== -1){
        if(parent.className.indexOf(' btn-primary')!==-1){
            parent.className = parent.className.replace(' btn-primary','');
        }
    }
});

$(document).mouseover(function(event){
    var parent = event.target.parentNode;
    if(!parent.className) return;

    if(parent.className.indexOf('osOrder')!== -1){
        return;
    }else if(parent.className.indexOf('configOrder')!== -1){
        if(parent.className.indexOf(' btn-primary')===-1){
            parent.className += ' btn-primary';
        }
    }else if(parent.className.indexOf('startTime')!== -1){
        
        if(parent.className.indexOf(' btn-primary')===-1){
            parent.className += ' btn-primary';
        }

    }else if(parent.className.indexOf('endTime')!== -1){
        if(parent.className.indexOf(' btn-primary')===-1){
            parent.className += ' btn-primary';
        }
    }else if(parent.className.indexOf('slotSequence')!== -1){
        if(parent.className.indexOf(' btn-primary')===-1){
            parent.className += ' btn-primary';
        }
    }
   
});
