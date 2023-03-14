const fs = require('fs')

// const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// const getFilePath = (subject, fileType) => {
//     let date = new Date().getTime()
//     let filePath = ''
//     if(subject) {
//         filePath = `reports/Report_${subject}_${date}.${fileType}`
//     } else {
//         let randomString = generateString(4)
//         filePath = `reports/Report_${randomString}_${date}.${fileType}`
//     }

//     return filePath
// }

// const deleteAllfilesFromReports = () => {
//     try { 
//         var files = fs.readdirSync('reports');
//         if (files.length > 0)
//         for (var i = 0; i < files.length; i++) {
//             var filePath =  'reports/' + files[i];
//             if (fs.statSync(filePath).isFile())
//                 fs.unlinkSync(filePath);
//             else
//                 rmDir(filePath);
//         } 
//     }
//     catch (e) { 
//         return; 
//     }
// }

// const generateString = (length) => {
//     let result = ' ';
//     const charactersLength = characters.length;
//     for ( let i = 0; i < length; i++ ) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }

let stringObject = () => {
    return {
      lockScreen: "State/District/School is locked for scanning" 
    };
  };

module.exports = {
    // getFilePath,
    // deleteAllfilesFromReports,
    stringObject
}