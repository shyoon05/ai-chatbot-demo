import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화 (실제 배포 시에는 환경변수 사용)
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY || 'demo-key', // 실제 배포 시 환경변수로 설정
	dangerouslyAllowBrowser: true // 데모용으로만 사용
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message, history } = await request.json();

		// 데모용 응답 (실제 OpenAI API 키가 없을 때)
		if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
			return json({
				response: generateDemoResponse(message)
			});
		}

		// 대화 히스토리 구성
		const messages = [
			{
				role: 'system' as const,
				content: `당신은 친절하고 도움이 되는 AI 고객 서비스 챗봇입니다. 
				고객의 질문에 정확하고 유용한 답변을 제공하세요. 
				한국어로 답변하되, 고객이 영어로 질문하면 영어로 답변하세요.
				항상 친근하고 전문적인 톤을 유지하세요.`
			},
			...history,
			{
				role: 'user' as const,
				content: message
			}
		];

		// OpenAI API 호출
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages,
			max_tokens: 500,
			temperature: 0.7
		});

		const response = completion.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.';

		return json({
			response
		});
	} catch (error) {
		console.error('Chat API Error:', error);
		return json(
			{
				response: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.'
			},
			{ status: 500 }
		);
	}
};

// 데모용 응답 생성 함수
function generateDemoResponse(message: string): string {
	const lowerMessage = message.toLowerCase();
	
	// 한국어 키워드 기반 응답
	if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
		return '안녕하세요! AI 고객 서비스 챗봇입니다. 무엇을 도와드릴까요?';
	}
	
	if (lowerMessage.includes('주문') || lowerMessage.includes('order')) {
		return '주문 관련 문의를 도와드리겠습니다. 주문 번호나 구매하신 상품명을 알려주시면 더 자세히 도와드릴 수 있습니다.';
	}
	
	if (lowerMessage.includes('배송') || lowerMessage.includes('delivery')) {
		return '배송 관련 문의를 도와드리겠습니다. 주문 번호를 알려주시면 배송 현황을 확인해드릴 수 있습니다.';
	}
	
	if (lowerMessage.includes('환불') || lowerMessage.includes('refund')) {
		return '환불 관련 문의를 도와드리겠습니다. 환불 사유와 주문 번호를 알려주시면 절차를 안내해드리겠습니다.';
	}
	
	if (lowerMessage.includes('가격') || lowerMessage.includes('price')) {
		return '가격 관련 문의를 도와드리겠습니다. 어떤 상품의 가격을 확인하고 싶으신가요?';
	}
	
	if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
		return '도움이 필요하시군요! 주문, 배송, 환불, 가격 등 다양한 문의를 도와드릴 수 있습니다. 구체적으로 어떤 도움이 필요하신가요?';
	}
	
	if (lowerMessage.includes('감사') || lowerMessage.includes('thank')) {
		return '천만에요! 더 도움이 필요하시면 언제든 말씀해주세요.';
	}
	
	// 영어 키워드 기반 응답
	if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
		return 'Hello! I\'m an AI customer service chatbot. How can I help you today?';
	}
	
	if (lowerMessage.includes('order')) {
		return 'I can help you with your order. Please provide your order number or the product name you purchased for more detailed assistance.';
	}
	
	if (lowerMessage.includes('delivery')) {
		return 'I can help you with delivery inquiries. Please provide your order number so I can check the delivery status for you.';
	}
	
	if (lowerMessage.includes('refund')) {
		return 'I can help you with refund inquiries. Please provide the reason for the refund and your order number, and I\'ll guide you through the process.';
	}
	
	if (lowerMessage.includes('price')) {
		return 'I can help you with price inquiries. Which product\'s price would you like to check?';
	}
	
	if (lowerMessage.includes('help')) {
		return 'You need help! I can assist with various inquiries such as orders, delivery, refunds, pricing, and more. What specific help do you need?';
	}
	
	if (lowerMessage.includes('thank')) {
		return 'You\'re welcome! Feel free to ask if you need any more help.';
	}
	
	// 기본 응답
	const responses = [
		'죄송합니다. 질문을 정확히 이해하지 못했습니다. 좀 더 구체적으로 말씀해주시면 도움을 드릴 수 있습니다.',
		'흥미로운 질문이네요! 좀 더 자세한 정보를 주시면 더 정확한 답변을 드릴 수 있습니다.',
		'이 질문에 대해 도움을 드리고 싶습니다. 구체적으로 어떤 부분에 대해 궁금하신가요?',
		'좋은 질문입니다! 주문, 배송, 환불, 가격 등 어떤 부분에 대해 문의하시는 건가요?',
		'I\'m sorry, I didn\'t understand your question clearly. Could you please provide more specific details so I can help you better?'
	];
	
	return responses[Math.floor(Math.random() * responses.length)];
} 