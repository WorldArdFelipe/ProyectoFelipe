
let search_file_button;
let input_file_upload;
let file;
let file_upload_name;
let dropArea;
let button_upload_model;
let buttonDownload;
let buttonAnalyze;

document.addEventListener("DOMContentLoaded", function(event) {

    dropArea = document.querySelector(".drag-area");
    file_upload_name = document.querySelector(".file_upload_name");

    search_file_button = dropArea.querySelector(".button");
    input_file_upload = dropArea.querySelector("input");

    button_upload_model = document.querySelector(".button_upload_model");

    buttonDownload = document.querySelector(".button_upload_model");
    buttonAnalyze = document.querySelector(".button_predict");

    file;


    navigation();
    function_drag_and_drop();
    function_upload_model();
    colorScore();
    questions_form();
    function_button_analyze();
    function_select_model_trained();

});


function function_select_model_trained()
{
    const radios = document.querySelectorAll('input[name="options"]');
    radios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            name_model = this.nextSibling.textContent.trim();
            fetch_model(name_model);
        }
    });
    });



   
}

function questions_form(){
        const form_questions = document.getElementById("form-flex");
        const children_form = document.querySelector("#options-form");

        question_list = [
            "Fiebre",
            "Dolor de Cabeza",
            "Dolor Retroocular",
            "Dolor Muscular",
            "Dolor Articulaciones",
            "Erupciones",
            "Dolor Abdominal",
            "Vomito",
            "Diarrea",
            "Somnolencia",
            "Presión Arterial baja",
            "Hemorragias",
            "Hipotermia",
            "Acumulación de líquidos",
        ]
        
        var count = 4;
        question_list.forEach(row => {
            const newElement = children_form.cloneNode(true);
            const get_title = newElement.querySelector(".title_option");
            const get_name_radio = newElement.querySelectorAll(".form-check-input");
            get_name_radio.forEach((radio, k) => {
                const newId = radio.id + '-' + count;
               

                const label = newElement.querySelector(`label[for="${radio.id}"]`);
                if (label) {
                    if (label.textContent == "M"){
                        label.innerHTML="Si"
                    }else{
                        label.innerHTML="No"
                    }
                    
                    label.setAttribute('for', newId);
                    
                }
            
                radio.id = newId;
                radio.name = 'inlineRadioOptions-' + count ;

                
                
            });

            get_title.innerHTML=count+1+". "+row+": ";
    
            form_questions.appendChild(newElement);
            count++;
        })

       
    
};

// Navigation
function navigation()
{
    document.querySelectorAll('.nav_link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 

            document.querySelectorAll('.nav_link').forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('section').forEach(section => section.classList.remove('active'));

            const target = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });

        const firstLink = document.querySelector('.nav_link');
        if (firstLink) {
            firstLink.classList.add('active');
            const firstSectionId = firstLink.getAttribute('href').substring(2);
            const firstSection = document.getElementById(firstSectionId);
            if (firstSection) {
                firstSection.classList.add('active');
            }
        }
    });

    document.getElementById('prediction').classList.add('active');

}

//Function Upload File
function function_drag_and_drop()
{
    search_file_button.onclick = () => {
        input_file_upload.click();
    };

    input_file_upload.addEventListener("change", function () {
        file = this.files[0];
        dropArea.classList.add("active");
        upload_file();
    });

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("active");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        file = event.dataTransfer.files[0]; 
        upload_file();
    });

}

function upload_file() {
    let fileType = file.type;
    let validExtensions = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "application/vnd.ms-excel", // .xls
        "text/csv" // .csv
    ];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            file_upload_name.style.display = "block";
            dropArea.classList.add("active");
            file_upload_name.innerHTML = `File Upload: ${file.name}`;
        };
        fileReader.readAsDataURL(file);
        console.log("true upload file")
    } else {
        alert("Error File Upload");
        dropArea.classList.remove("active");
    }

}

// Function Button Upload
function function_upload_model()
{
    buttonDownload.onclick = () => {
    
        if(file){
            
            fethapi();
            Alert("File uploaded successfully, Analyzing.","sucefull")
        }else{
            Alert("Error, You have not selected any file.")
        }
    };

}

//Alert Toast
function Alert(msg,alert="error",time=2500)
{
    var option={
        animation:true,
        delay:time,
    };
    const toastElList = document.getElementById("msg_alert")
    const toastName = document.querySelector(".msg_error")
    let bsAlert = new bootstrap.Toast(toastElList,option);
    toastElList.classList.add(alert);
    toastName.textContent =msg;
    bsAlert.show();
}

//Colors Scores
function colorScore()
{

    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const scoreCell = row.querySelector('td:nth-child(3)');
        const scoreNew = scoreCell.querySelector("span");

        const score = parseFloat(scoreNew.textContent);

        if (score < 0.50) { 
            scoreNew.classList.add('low');
        }else if(score >= 0.50 && score < 0.80 ){
            scoreNew.classList.add('medium');
        }
        else if(score >= 0.80 ){
            scoreNew.classList.add('high');
        }
    });
}

//Create Score

function addScore(data)
{

    let score_get_api = data["score_model"];
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    Object.entries(score_get_api).forEach(([key, value], index) => {

        const newRow = document.createElement('tr');
        const indexScore = document.createElement('td');
        const titleScore = document.createElement('td');
        const scoreCell = document.createElement('td');
        const scoreSpan = document.createElement('span');
        scoreSpan.classList.add("badge","badge-pill","badge-primary");

        indexScore.textContent = index;
        titleScore.textContent = key;
        scoreSpan.textContent = parseFloat(value.toFixed(4));

        scoreCell.appendChild(scoreSpan);

        newRow.appendChild(indexScore);
        newRow.appendChild(titleScore);
        newRow.appendChild(scoreCell);

        tableBody.appendChild(newRow);
        
    });

    colorScore();
    graphScore(Object.keys(score_get_api),Object.values(score_get_api));

}

function addDescribe(data)
{
    let describe_data = JSON.parse(data["describe_data"]);
    const tableBody = document.getElementById('tableBodyDescribe');
    tableBody.innerHTML = '';

    const metrics = Object.keys(describe_data);
    const metricHeaders = metrics.map(metric => `<th>${metric}</th>`).join('');
    tableBody.innerHTML = `<tr><th>Métrica</th>${metricHeaders}</tr>`;

    const attributes = Object.keys(describe_data[metrics[0]]);
    attributes.forEach(attribute => {
      const row = document.createElement('tr');
      const cells = metrics.map(metric => `<td>${describe_data[metric][attribute]}</td>`).join('');
      row.innerHTML = `<td>${attribute}</td>${cells}`;
      tableBody.appendChild(row);
    });
}


//FethPoint
async function fetch_model(model){
    const url = `http://127.0.0.1:5000/get_model_train/${model}`;

    try {
        await fetch(url,{
            method : 'POST',
            
        })
        .then(response => response.json())
        .then(data => {
            addScore(data);
            addDescribe(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    } catch (error) {
        console.error(error.message);
    }
}


//FethPoint
async function fethapi(){
    const url = "http://127.0.0.1:5000/train";
    const formData = new FormData();
    formData.append("file", file);

    try {
        await fetch(url,{
            method : 'POST',
            body : formData,
        })
        .then(response => response.json())
        .then(data => {

        })
        .catch(error => {
            console.error('Error:', error);
        });

    } catch (error) {
        console.error(error.message);
    }
}

async function fetch_predict(args_new){
    const url = "http://127.0.0.1:5000/get_model_predict";
    try {
        await fetch(url,{
            method : 'POST',
            body: args_new
            
        })
        .then(response => response.json())
        .then(data => {
            AddResults(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });

    } catch (error) {
        console.error(error.message);
    }
}


function AddResults(data)
{   
    console.log(data)
    let value_get = data["Value"];
    const get_result = document.getElementById('result_model');
    get_result.textContent = value_get;

    console.log(get_result);

}

function function_button_analyze(){
    buttonAnalyze.onclick = () => {
        const valores = {};
        const radioSets = document.querySelectorAll('input[type="radio"], input[type="text"]');

        radioSets.forEach((input) => {
            const name = input.name;
            if(name.includes("inlineRadioOptions")){
                valores[name] = "None";
            }
        });

        radioSets.forEach((input) => {
            const name = input.name;
            if(name.includes("inlineRadioOptions")){
                if (input.type === 'radio' && input.checked) {
                    const value = input.value;
                    valores[name] = value;
                } else if (input.type === 'text') {
                    const value = input.value;
                    valores[name] = value;
                }
            }
            
        });

        fetch_predict(JSON.stringify(valores));
        
    };

}

function graphScore(keys,values){

    TESTER = document.getElementById('graph_score');
    data =  [{
        x:keys,
        y: values,
        type: "bar",
        text: values,
        textposition: 'auto',
        texttemplate: '%{text:.0%}',
        /*marker: {
           color: ['#14ca74','#ca3814',"#fdb52a"],
        },*/
    }];

    var layout = {

        height: 210,

        title: {
            text: 'Bar Model Metrics', 
            font: {
                size: 17,  
                color: '#aeb9e1'
            },
        },
        xaxis: {
            tickfont: {
                color: '#ffffff',
            }
        },
        yaxis: {
            gridwidth: 1,
            range:[0,1.1],
            gridcolor: '#37446b',
            tickfont: {
                color: '#727ca0',                
            }
        },

        showlegend: false,
        plot_bgcolor: "rgba(0,0,0,0)",
        paper_bgcolor: "rgba(0,0,0,0)",

        margin: {
            l: 35,  
            r: 35, 
            t: 35, 
            b: 25 
        },
        autosize: true
    };

    Plotly.newPlot(TESTER, data, layout, {displayModeBar: false});  

}
