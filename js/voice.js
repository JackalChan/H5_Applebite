var voiceRec = {

	recognizing: false,

	recognition: {},

	final_transcript: "",

	interim_transcript: "",

	test_index : 0,

	start: function (callback) {
		var self = this;

		// 如果找不到 window.webkitSpeechRecognition 這個屬性
		if (!('webkitSpeechRecognition' in window)) {  
			// 就是不支援語音辨識，要求使用者更新瀏覽器。 
		  	console.log("本瀏覽器不支援語音辨識，請更換瀏覽器！(Chrome 25 版以上才支援語音辨識)");
		} else {
		  
		  	self.recognition = new webkitSpeechRecognition(); // 建立語音辨識物件 webkitSpeechRecognition
		  	self.recognition.continuous = true; // 設定連續辨識模式
		  	self.recognition.interimResults = true; // 設定輸出中先結果。

		  	self.recognition.onstart = function() { // 開始辨識
		    	self.recognizing 	 	= true; // 設定為辨識中
		    	self.recognition.lang 	= "cmn-Hant-TW";
		   		console.log("辨識中...");  // 顯示訊息為「辨識中」...
		  	};

		  	self.recognition.onend = function() { // 辨識完成
		    	self.recognizing 	= false; // 設定為「非辨識中」
		  		console.log("結束辨識...");
		  	};

		  	self.recognition.onresult = function(event) { // 辨識有任何結果時

		    	
		    	for (var i = event.resultIndex; i < event.results.length; ++i) { // 對於每一個辨識結果
		     
			        	self.interim_transcript = event.results[i][0].transcript; // 將其加入中間結果中
			      		console.log("中間值[0]:",i,self.interim_transcript);
			      		// console.log("準確率[0]:Index",event.results[i][0].confidence);
			      		//alert(event.results[i][0].confidence);
		    	}

				console.log("test:", self.test_index++);
		    	callback(self.interim_transcript);

		  	};
		}

		self.recognition.start(); // 開始辨識
	},
}
var msgCanvas, msgCtx;
