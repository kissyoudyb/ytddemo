//默认菜单项
var sampleData2 = [{
	
	id: 'pmenu',
	label: '个人业务',
	level: '1',
	subTree: [{
		
		id: 'personalopen',
		label: '个人开户',
		img: 'personalopen.png',
		level: '2',
		subTree: [{
		
			id:'save',
			label: '储蓄账户',
			img: 'save.png',
			level: '3',
			url: '../personalAccount/agentSelect.html',
			padurl: '../personalAccount/agentSelect.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000001',
			cqsmBusiType: 'M4'
		},{
		
			id:'private',
			label: '结算通卡',
			img: 'private.png',
			level: '3',
			url: '../settlementCard/settlementCardTips.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000038',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'creditcard',
			label: '信用卡',
			img: 'creditcard.png',
			level: '3',
			url: '../identityCheck/check.html',
			padurl: '../creditCardApplyNew/cardTypeSelect.html',
			beforetip:'申请信用卡无须取号，请联系大堂经理指导您办理业务',
			aftertip:'',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000004',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'wealthmanage',
			label: '理财卡',
			img: 'wealthmanage.png',
			level: '3',
			url: '../wealthManagementCard/wealthTips.html',
			padurl: '../wealthManagementCard/wealthIdCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000040',
			cqsmBusiType: 'M4'
				
		}]
			
	},{
		id: 'transfer',
		label: '转账汇款',
		level: '2',
		img: 'transfer.png',
		subTree: [{
		
			id:'innertransfer',
			label: '同行汇款',
			img: 'innertransfer.png',
			level: '3',
			url: '../nopreOrderBusi/beforeFetchNo.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'尊敬的客户，为了节约您的时间，5万以下的同行转账业务可移步至存取款机办理，无须取号',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		},{
		
			id:'crosstransfer',
			label: '跨行转账',
			img: 'crosstransfer.png',
			level: '3',
			url: '../quickRemit/isAgentSelect.html',
			padurl: '../quickRemit/isAgentSelect.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000003',
			cqsmBusiType: 'M2'
				
		}]
	},{
		id: 'personalsign',
		label: '个人签约',
		level: '2',
		img: 'personalsign.png',
		subTree: [{
		
			id:'atmservice',
			label: 'ATM服务',
			img: 'atmservice.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'ebank',
			label: '电子银行',
			img: 'ebank.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'stockaccount',
			label: '股票账户',
			img: 'stockaccount.png',
			level: '3',
			url: '../ctsApply/check.html',
			padurl: '../ctsApply/ctsApply.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000000020',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'homebank',
			label: '家居银行',
			img: 'homebank.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'stockservice',
			label: '证劵服务',
			img: 'stockservice.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		}]
	},{
		id: 'cash',
		label: '现金业务',
		level: '2',
		img: 'cash.png',
		subTree: [{
		
			id:'savemoney',
			label: '存款',
			img: 'savemoney.png',
			level: '3',
			url: '../nopreOrderBusi/beforeFetchNo.html',
			padurl: '../nopreOrderBusi/beforeFetchNo.html',
			beforetip:'尊敬的客户，为了节约您的时间，2万元以下存款业务可移步至自助存款机办理，无须取号。',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M1'
		},{
		
			id:'withdraw',
			label: '取款',
			img: 'withdraw.png',
			level: '3',
			url: '../nopreOrderBusi/beforeFetchNo.html',
			padurl: '../nopreOrderBusi/beforeFetchNo.html',
			beforetip:'尊敬的客户，为了节约您的时间，2万元以下取款业务可移步至自助存款机办理，无须取号。',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M1'
				
		},{
		
			id:'personalpay',
			label: '个人缴费',
			img: 'personalpay.png',
			level: '3',
			url: '../nopreOrderBusi/beforeFetchNo.html',
			padurl: '../nopreOrderBusi/beforeFetchNo.html',
			beforetip:'尊敬的客户，为了节约您的时间，缴纳交警罚款可移步至自助终端设备办理，无须取号。',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M1'
				
		}]
	},{
		id: 'investment',
		label: '投资理财',
		level: '2',
		img: 'investment.png',
		subTree: [{
		
			id:'ccbfinancialprod',
			label: '建行理财产品',
			img: 'ccbfinancialprod.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
				
		},{
		
			id:'preciousmetal',
			label: '贵金属业务',
			img: 'preciousmetal.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'fundbusiness',
			label: '基金业务',
			img: 'fundbusiness.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M4'
				
		},{
		
			id:'insuranceagent',
			label: '代理保险',
			img: 'insurancebusiness.png',
			level: '3',
			url: '../identityCheck/check.html',
			beforetip:'',
			aftertip:'',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			padurl: '../insuranceAgent/insurance_index.jsp',
			busiTypeCode: '0000000015',
			cqsmBusiType: 'M4'
				
		}]
	},{
		id: 'lost',
		label: '挂失销户',
		level: '2',
		img: 'lost.png',
		subTree: [{
		
			id:'cardlost',
			label: '卡存折挂失',
			img: 'cardlost.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
			
		},{
		
			id:'passwordlost',
			label: '密码挂失',
			img: 'passwordlost.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		},{
		
			id:'cancelcard',
			label: '银行卡销户',
			img: 'cancelcard.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		}]
	},{
		id: 'foreignexchangebusiness',
		label: '外汇业务',
		level: '2',
		img: 'foreignexchangebusiness.png',
		subTree: [{
		
			id:'settlementandsale',
			label: '结售汇',
			img: 'settlementandsale.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M3'
				
		},{
		
			id:'foreignexchange',
			label: '外汇汇款',
			img: 'foreignexchange.png',
			level: '3',
			url: '../foreignCurrencyRemit/icCheck.html',
			padurl: '../foreignCurrencyRemit/foreignCurrencyRemit.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往休息区等候',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: '0000100010',
			cqsmBusiType: 'M3'
				
		}]
	},{
		id: 'other',
		label: '其他业务',
		level: '2',
		img: 'other.png',
		subTree: [{

            id:'badcardchange',
            label: '损坏换卡/折',
            img: 'badcardchange.png',
            level: '3',
            url: '../specialCardReceive/specialCardIdCheck.html',
            padurl: '../nopreOrderBusi/idCheck.html',
            beforetip:'',
            aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
            padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
            busiTypeCode: '0000000005',
            cqsmBusiType: 'M2'
				
		},{
		
			id:'fullbankbookchange',
			label: '满页换折',
			img: 'fullbankbookchange.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		},{
		
			id:'personalinfochange',
			label: '个人资料修改',
			img: 'personalinfochange.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		},{
		
			id:'personalloan',
			label: '个人贷款',
			img: 'personalloan.png',
			level: '3',
			url: '../nopreOrderBusi/idCheck.html',
			padurl: '../nopreOrderBusi/idCheck.html',
			beforetip:'',
			aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
			padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
			busiTypeCode: 'xxxxxxxxxx',
			cqsmBusiType: 'M2'
				
		}]
	}]
		
},{
	id: 'emenu',
	label: '对公业务',
	level: '1',
	subTree: [{
		id: 'etransfer',
		label: '对公转账及汇款',
		level: '2',
		img:'etransfer.png',
		url:'../receipts/receiptsIcCheck.html',
		padurl:'../receipts/receiptsIcCheck.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '6666666666',
		cqsmBusiType: 'M5'
		
	},{
		id: 'ecash',
		label: '对公现金',
		img:'ecash.png',
		level: '2',
		url:'../cashPayment/cashPaymentIcCheck.html',
		padurl:'../nopreOrderBusi/idCheck.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '5555555555',
		cqsmBusiType: 'M6'
	},{
		id: 'eaccount',
		label: '对公一体化签约',
		img:'eaccount.png',
		level: '2',
		url:'../integrationContract/ccbCheck.html',
		padurl:'../integrationContract/ccbCheck.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0001000041',
		cqsmBusiType: 'M10'
	}]
},{
	id: 'padmenu',
	label: '平板业务',
	level: '1',
	subTree: [{
		id: 'save-pad',
		label: '储蓄账户',
		level: '2',
		img:'save-pad.png',
		url: '../personalAccount/agentSelect.html',
		padurl: '../personalAccount/agentSelect.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往休息区等候',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000001',
		cqsmBusiType: 'M4'
		
	},{
		id: 'creditcard-pad',
		label: '信用卡',
		img:'creditcard-pad.png',
		level: '2',
		url: '../identityCheck/check.html',
		padurl: '../creditCardApplyNew/cardTypeSelect.html',
		beforetip:'申请信用卡无须取号，请联系大堂经理指导您办理业务',
		aftertip:'',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000004',
		cqsmBusiType: 'M4'
	},{
		id: 'insurancebusiness-pad',
		label: '代理保险',
		img:'insurancebusiness-pad.png',
		level: '2',
		url: '../identityCheck/check.html',
		beforetip:'',
		aftertip:'',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		padurl: '../insuranceAgent/insurance_index.jsp',
		busiTypeCode: '0000000015',
		cqsmBusiType: 'M4'
	},{
		id: 'foreignexchange-pad',
		label: '外汇汇款',
		img:'foreignexchange-pad.png',
		level: '2',
		url: '../foreignCurrencyRemit/icCheck.html',
		padurl: '../foreignCurrencyRemit/foreignCurrencyRemit.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往休息区等候',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000100010',
		cqsmBusiType: 'M3'
	}]
},{
	id: 'padmenu22',
	label: '平板业务',
	level: '1',
	subTree: [{
		id: 'personalopen-pad',
		label: '储蓄账户',
		level: '2',
		img:'personalopen-pad.png',
		url: '../personalAccount/agentSelect.html',
		padurl: '../personalAccount/agentSelect.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往休息区等候',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000001',
		cqsmBusiType: 'M4'
		
	},{
		id: 'creditcard-pad2',
		label: '信用卡',
		img:'creditcard-pad2.png',
		level: '2',
		url: '../identityCheck/check.html',
		padurl: '../creditCardApplyNew/cardTypeSelect.html',
		beforetip:'申请信用卡无须取号，请联系大堂经理指导您办理业务',
		aftertip:'',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000004',
		cqsmBusiType: 'M4'
	},{
		id: 'insurancebusiness-pad',
		label: '代理保险',
		img:'insurancebusiness-pad.png',
		level: '2',
		url: '../identityCheck/check.html',
		beforetip:'',
		aftertip:'',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		padurl: '../insuranceAgent/insurance_index.jsp',
		busiTypeCode: '0000000015',
		cqsmBusiType: 'M4'
	},{
		id: 'foreignexchange-pad2',
		label: '外汇汇款',
		img:'foreignexchange-pad2.png',
		level: '2',
		url: '../foreignCurrencyRemit/icCheck.html',
		padurl: '../foreignCurrencyRemit/foreignCurrencyRemit.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往休息区等候',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000100010',
		cqsmBusiType: 'M3'
	},{
		id: 'wealthmanage-pad.png',
		label: '理财卡',
		img:'wealthmanage-pad.png',
		level: '2',
		url: '../wealthManagementCard/wealthTips.html',
		padurl: '../wealthManagementCard/wealthIdCheck.html',
		beforetip:'',
		aftertip:'请取走您的排队号，联系大堂经理指引您办理后续业务',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000040',
		cqsmBusiType: 'M4'
	},{
		id: 'crosstransfer-pad.png',
		label: '跨行转账',
		img:'crosstransfer-pad.png',
		level: '2',
		url: '../quickRemit/isAgentSelect.html',
		padurl: '../quickRemit/isAgentSelect.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000003',
		cqsmBusiType: 'M2'
	},{
		id: 'stockaccount-pad.png',
		label: 'CTS',
		img:'stockaccount-pad.png',
		level: '2',
		url: '../ctsApply/check.html',
		padurl: '../ctsApply/ctsApply.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000020',
		cqsmBusiType: 'M4'
	},{
		id: 'badcardchange-pad.png',
		label: '特殊业务',
		img:'badcardchange-pad.png',
		level: '2',
		url: '../specialCardReceive/specialCardIdCheck.html',
		padurl: '../specialCardReceive/specialCardReceive.html',
		beforetip:'',
		aftertip:'请取走您的排队号，前往填单区填写业务申请书。如有疑问，请联系大堂经理。',
		padtip:'暂不支持填单业务,请您联系大堂经理指引您办理后续业务',
		busiTypeCode: '0000000005',
		cqsmBusiType: 'M2'
	}]
}];

