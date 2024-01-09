const fs = require('fs');
let rawdata = fs.readFileSync('./6424322.json');
let blockAttestations = JSON.parse(rawdata);

const attestationsCount = blockAttestations.data.length;
//console.log("Quantity of attestations in block: ", attestationsCount);

let attestationsTable = new Array(attestationsCount);
for(var i = 0; i < attestationsCount; i++){
	attestationsTable[i] = new Array();
    attestationsTable[i] = [blockAttestations.data[i].data.index,blockAttestations.data[i].data.beacon_block_root, blockAttestations.data[i].data.slot, blockAttestations.data[i].data.source.epoch, blockAttestations.data[i].data.target.epoch];
}
//console.log("All attestations in block: ", attestationsTable);
//console.log("Single attestation in block: ", attestationsTable[1]);

function findRepeatingPairs(arr) {
    const repeatingPairs = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const row1 = arr[i].join(',');
        const row2 = arr[j].join(',');
        if (row1 === row2) {
          repeatingPairs.push([i, j]);
        }
      }
    }
    return repeatingPairs;
  }
const repeatingPairs = findRepeatingPairs(attestationsTable);
//console.log("All repeating attestations in block: ", repeatingPairs);
//console.log("First pair of repeating attestations: ", repeatingPairs[0]);

let aggregationTable = new Array(attestationsCount);
for(var i = 0; i < attestationsCount; i++){
    aggregationTable[i] = new Array();
    const cleanHexString = blockAttestations.data[i].aggregation_bits.slice(2);
    let binaryString = '';
    for (let i = 0; i < cleanHexString.length; i++) {
        const hexDigit = cleanHexString.charAt(i);
        const binaryValue = parseInt(hexDigit, 16).toString(2).padStart(4, '0');
        binaryString += binaryValue;
      }
    aggregationTable[i] = binaryString;
}

let allAttestationsCount = 0;
for (let i = 0; i < aggregationTable.length; i++) {
  let aggregationString = aggregationTable[i];
  let targetChar = '1';
  let charCount = aggregationString.split(targetChar).length - 1;
  allAttestationsCount += charCount;
}
console.log("Count of all attestations in block: ",allAttestationsCount);

let repeatingAttestationsCount = 0;
for (let i = 0; i < repeatingPairs.length; i++) {
  for (let n = 0; n < aggregationTable.length; n++) {
      if (aggregationTable[repeatingPairs[i][0]].charAt(n) == aggregationTable[repeatingPairs[i][1]].charAt(n)) { 
      } else {
        repeatingAttestationsCount++;
      }
  }
}
console.log("Count of all repeating attestations: ",repeatingAttestationsCount);

let uniqueAttestationsCount = allAttestationsCount - repeatingAttestationsCount;
console.log("Count of all unique attestations: ",uniqueAttestationsCount);