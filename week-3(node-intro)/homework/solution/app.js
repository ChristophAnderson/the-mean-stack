var fs = require('fs');
var superagent = require('superagent');

module.exports.run = function(flags) {
  var fileApp = new FactsApp(flags);
  fileApp.init();
};

function FactsApp (flags) {
  this.flags = flags;
  // this.base = "http://numbersapi.com"
}

FactsApp.prototype.init = function() {
  
  // 'math' comes from cli.js
  if (this.flags.math) {
    // console.log(this.flags.math);
    if (this.flags.save) {
      this.math(true);
    } else {
      this.math();
    }
  }
  if (this.flags.trivia) {
    if (this.flags.save) {
      this.trivia(true);
    } else {
      this.trivia();
    }    
  }
  if (this.flags.date) {
    if (this.flags.save) {
      this.date(true);
    } else {
      this.date();
    }
  }
  
};

// to use (in terminal):
// node cli.js --math **numberHere** 
FactsApp.prototype.math = function(save) {
  
  var number = this.flags.math;
  
  superagent.get("http://numbersapi.com/" + number + "/math")
  .end(function (err, response) {
    
    var text = response.text;
    console.log("math: " + text);
    if (save) {
      // saveToJSON(fact, inputNumber, isFound, factType)
      saveToJSON(text, number, response.found, "math");
    }
    
  });
  
};

FactsApp.prototype.trivia = function (save) {
  
  var number = this.flags.trivia;
  
  superagent.get("http://numbersapi.com/" + number + "/trivia")
  .end(function (err, response) {
    var text = response.text;
    console.log("trivia: " + text);
    if (save) {
      // saveToJSON(fact, inputNumber, isFound, factType)
      saveToJSON(text, number, response.found, "trivia");
    }
  });
  
};

// TODO: use base to build url
// TODO: change .date to .getDateFact
FactsApp.prototype.date = function (number) {
  var url = this.base + '/';
  var format = number.split("/");
  
  this.apiRequest(url);
}

FactsApp.prototype.apiRequest = funciton(url, callback) {
  var self = this;
  superagent.get(url)
    .query({json: true})
    .end(function(err, res) {
      if (err) throw err;
      
      if (self.flags.save) {
        res.body.saved = new Date();
        self.saveFact(res.body);
      }
      
      console.log(res.body.type + ": " + res.body.text);
    });
};

// TODO: end

FactsApp.prototype.date = function(save) {
  
  var input = String(this.flags.date);
  
  if (input.indexOf('/') > -1) { // return date fact
    superagent.get("http://numbersapi.com/" + input + "/date")
    .end(function (err, response) {
      var text = response.text;
      console.log("date: " + text);
      
      if (save) {
        // saveToJSON(fact, inputNumber, isFound, factType)
        saveToJSON(text, input, response.found, "date");
      }
    });
  } else { // return year fact
    superagent.get("http://numbersapi.com/" + input + "/year")
    .end(function (err, response) {
      var text = response.text;
      console.log("date: " + text);
      
      if (save) {
        // saveToJSON(fact, inputNumber, isFound, factType)
        saveToJSON(text, input, response.found, "date");
      }
    });
  }
  
};

function saveToJSON(fact, inputNumber, isFound, factType) {
    
  var today = new Date();
  var date = today.toString();
  
  // check if file exists:
  fs.readFile("facts.json", function(err, data) {
    if  (err) {  // if file doesn't exist:
    
    // TODO: try-catch JSON.parse when reading file
/*
fs.readFile(filename, 'utf8', function (err, data) {
try {
var facts = JSON.parse(data);
facts.push(fact);
self.writeFile(filenmae, facts);
} catch (err) {
throw err;
}
});
*/

    
    fs.writeFile("facts.json", JSON.stringify({text: fact, number: inputNumber, found: isFound, type: factType, saved: date}, null, 2), function(err) {
      
      if (err) throw err;
      console.log('Saved fact to facts.json');
    });
    
  } else {  // if file already exists:
    
    // get previous facts & append a comma
    var tempData = data.toString().split("");
    
    // check if first element is [
    if (tempData[0] !== "[") {
      tempData.unshift("[");
    }
    
    // remove closing ] if there
    if (tempData[tempData.length-1] === "]") {
      tempData[tempData.length-1] = "";
    }
    
    // append comma
    tempData.splice(tempData.length, 0, ",\n");
    
    // append new fact
    tempData.splice(tempData.length, fact.length, JSON.stringify({text: fact, number: inputNumber, found: isFound, type: factType, saved: date}, null, 2));
    // console.log("NEW DATA: " + tempData.join(""));
    
    // append closing ]
    if (tempData[tempData.length-1] !== "]") {
      tempData.push("]");
    }
    
    // remove file:
    fs.unlink("facts.json", function(err) {
      if (err) throw err;
      // console.log('Removed file');
    });
    
    // replace file:
    fs.writeFile("facts.json", tempData.join(""), function(err) {
      if (err) throw err;
      console.log('Saved fact to facts.json');
    });
    
  }
});  


}
