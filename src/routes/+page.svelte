<script lang="ts">
	import { onMount } from 'svelte';

	let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];
	let inputValue = '';
	let isLoading = false;

	// 초기 환영 메시지
	onMount(() => {
		messages = [
			{
				role: 'assistant',
				content: '안녕하세요! AI 고객 서비스 챗봇입니다. 무엇을 도와드릴까요?',
				timestamp: new Date()
			}
		];
	});

	async function handleSubmit() {
		if (!inputValue.trim()) return;

		const userMessage = {
			role: 'user' as const,
			content: inputValue,
			timestamp: new Date()
		};

		messages = [...messages, userMessage];
		const currentInput = inputValue;
		inputValue = '';
		isLoading = true;

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: currentInput,
					history: messages.slice(0, -1).map(msg => ({
						role: msg.role,
						content: msg.content
					}))
				})
			});

			if (response.ok) {
				const data = await response.json();
				messages = [
					...messages,
					{
						role: 'assistant',
						content: data.response,
						timestamp: new Date()
					}
				];
			} else {
				throw new Error('Failed to get response');
			}
		} catch (error) {
			messages = [
				...messages,
				{
					role: 'assistant',
					content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
					timestamp: new Date()
				}
			];
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
</script>

<svelte:head>
	<title>AI 고객 서비스 챗봇</title>
	<meta name="description" content="AI 챗봇 고객 서비스 데모" />
</svelte:head>

<main class="container">
	<div class="header">
		<h1>🤖 AI 고객 서비스 챗봇</h1>
		<p>자연어 처리로 고객 문의를 자동으로 처리하는 AI 챗봇입니다</p>
	</div>

	<div class="chat-container">
		<div class="messages">
			{#each messages as message, index}
				<div class="message {message.role}">
					<div class="message-content">
						{#if message.role === 'assistant'}
							<div class="avatar">🤖</div>
						{:else}
							<div class="avatar">👤</div>
						{/if}
						<div class="text">{message.content}</div>
					</div>
					<div class="timestamp">
						{message.timestamp.toLocaleTimeString('ko-KR', {
							hour: '2-digit',
							minute: '2-digit'
						})}
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="message assistant">
					<div class="message-content">
						<div class="avatar">🤖</div>
						<div class="text">
							<div class="typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<form class="input-container" on:submit|preventDefault={handleSubmit}>
			<div class="input-wrapper">
				<textarea
					bind:value={inputValue}
					on:keypress={handleKeyPress}
					placeholder="메시지를 입력하세요..."
					disabled={isLoading}
					rows="1"
				></textarea>
				<button type="submit" disabled={isLoading || !inputValue.trim()}>
					{#if isLoading}
						⏳
					{:else}
						📤
					{/if}
				</button>
			</div>
		</form>
	</div>

	<div class="features">
		<h3>주요 기능</h3>
		<div class="feature-grid">
			<div class="feature">
				<h4>🧠 자연어 처리 (NLP)</h4>
				<p>고객의 질문을 정확히 이해하고 적절한 답변을 제공합니다</p>
			</div>
			<div class="feature">
				<h4>🌍 다국어 지원</h4>
				<p>한국어, 영어 등 다양한 언어로 대화할 수 있습니다</p>
			</div>
			<div class="feature">
				<h4>💬 대화 맥락 유지</h4>
				<p>이전 대화 내용을 기억하여 연속적인 대화가 가능합니다</p>
			</div>
		</div>
	</div>
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 30px;
	}

	.header h1 {
		color: #2c3e50;
		margin-bottom: 10px;
		font-size: 2.5rem;
	}

	.header p {
		color: #7f8c8d;
		font-size: 1.1rem;
	}

	.chat-container {
		background: white;
		border-radius: 20px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		margin-bottom: 30px;
	}

	.messages {
		height: 400px;
		overflow-y: auto;
		padding: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.message {
		margin-bottom: 20px;
		animation: fadeIn 0.3s ease-in;
	}

	.message.user {
		text-align: right;
	}

	.message-content {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		max-width: 80%;
	}

	.message.user .message-content {
		flex-direction: row-reverse;
		margin-left: auto;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20px;
		flex-shrink: 0;
	}

	.message.assistant .avatar {
		background: #3498db;
	}

	.message.user .avatar {
		background: #2ecc71;
	}

	.text {
		background: white;
		padding: 12px 16px;
		border-radius: 18px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		line-height: 1.4;
		word-wrap: break-word;
	}

	.message.user .text {
		background: #2ecc71;
		color: white;
	}

	.timestamp {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 5px;
		text-align: center;
	}

	.message.user .timestamp {
		text-align: right;
	}

	.input-container {
		padding: 20px;
		background: white;
	}

	.input-wrapper {
		display: flex;
		gap: 10px;
		align-items: flex-end;
	}

	textarea {
		flex: 1;
		border: 2px solid #e0e0e0;
		border-radius: 25px;
		padding: 12px 20px;
		font-size: 1rem;
		resize: none;
		outline: none;
		transition: border-color 0.3s;
		font-family: inherit;
	}

	textarea:focus {
		border-color: #3498db;
	}

	textarea:disabled {
		background: #f5f5f5;
		cursor: not-allowed;
	}

	button {
		width: 50px;
		height: 50px;
		border: none;
		border-radius: 50%;
		background: #3498db;
		color: white;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover:not(:disabled) {
		background: #2980b9;
		transform: scale(1.05);
	}

	button:disabled {
		background: #bdc3c7;
		cursor: not-allowed;
		transform: none;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3498db;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}

	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}

	@keyframes typing {
		0%, 80%, 100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.features {
		background: white;
		border-radius: 20px;
		padding: 30px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.features h3 {
		text-align: center;
		color: #2c3e50;
		margin-bottom: 30px;
		font-size: 1.8rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
	}

	.feature {
		text-align: center;
		padding: 20px;
		border-radius: 15px;
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
		transition: transform 0.3s;
	}

	.feature:hover {
		transform: translateY(-5px);
	}

	.feature h4 {
		margin-bottom: 10px;
		font-size: 1.2rem;
	}

	.feature p {
		font-size: 0.9rem;
		opacity: 0.9;
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.container {
			padding: 10px;
		}

		.header h1 {
			font-size: 2rem;
		}

		.messages {
			height: 300px;
		}

		.message-content {
			max-width: 90%;
		}

		.feature-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
