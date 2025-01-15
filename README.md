Overview

Personalized Learning Assistant is an AI-powered tool designed to help users master complex topics with ease. By leveraging advanced technologies like Snowflake Cortex AI and Mistral LLM, this app provides tailored learning experiences through summaries, guides, FAQs, and quizzes. Whether you’re a student, a professional, or a lifelong learner, this tool adapts to your unique learning preferences and proficiency levels.

Features

✅ Customizable Learning Goals:
	•	Generate Summaries for a quick overview.
	•	Access Step-by-Step Guides for detailed learning.
	•	Get FAQs for common questions.
	•	Take Quizzes to reinforce understanding.

✅ Semantic Search:
	•	Retrieve the most relevant information from a large corpus of educational materials.

✅ Personalized Content:
	•	Tailored content based on user proficiency levels (Beginner, Intermediate, Expert).

✅ Interactive Frontend:
	•	Built with Streamlit for a smooth user experience.

✅ AI-Powered:
	•	Uses Snowflake Cortex AI for large language model integration and semantic search.

Technologies Used
	1.	Snowflake Cortex AI
	•	Mistral LLM for text generation and content personalization.
	•	Semantic search for retrieving relevant educational content.
	2.	Streamlit
	•	Interactive and user-friendly frontend.
	3.	Sentence-Transformers
	•	For embedding generation and indexing educational materials.
	4.	PDFMiner
	•	Extracting text from PDFs to create a rich knowledge base.
	5.	Python
	•	Backend logic for embedding, retrieval, and integration.

How to Run the Project

1. Clone the Repository

git clone https://github.com/yourusername/personalized-learning-assistant.git
cd personalized-learning-assistant

2. Set Up Environment Variables

Create a .env file and add your Snowflake configuration and API keys:

SNOWFLAKE_USER=your_snowflake_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
MISTRAL_API_KEY=your_mistral_api_key

3. Install Dependencies

Set up a virtual environment and install the required packages:

pip install -r requirements.txt

4. Run the App

Launch the Streamlit app:

streamlit run app.py

Usage
	1.	Upload PDFs or educational materials into the content/pdfs/ folder.
	2.	Use the app interface to:
	•	Input a topic or query.
	•	Select a learning goal (Summary, Guide, FAQ, Quiz).
	•	Choose your proficiency level.
	3.	View personalized results, including summaries, guides, FAQs, and quizzes.

File Structure

personalized-learning-assistant/
│
├── content/
│   └── pdfs/                 # Folder for uploading PDF documents
├── scripts/
│   ├── loading_pdfs.ipynb    # Script to process PDFs and generate embeddings
├── app.py                    # Main application file
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
└── .env                      # Environment variables (not included in the repository)

Challenges We Faced
	•	Extracting meaningful information from unstructured PDF content.
	•	Debugging cryptic Snowflake errors during Mistral LLM integration.
	•	Optimizing performance for real-time content generation.
	•	Designing an intuitive user interface that adapts to various learning styles.

Future Enhancements
	•	Multi-language support for global accessibility.
	•	Integration of multi-modal content (images, videos).
	•	Reinforcement learning for improved quiz generation.
	•	Custom dataset uploads for personalized learning paths.

Contributing

We welcome contributions to improve this project! Please fork the repository and submit a pull request with your enhancements or bug fixes.

Acknowledgments
	•	Snowflake for Cortex AI and LLM integration.
	•	Hugging Face for their incredible transformer models.
	•	The open-source community for providing powerful tools to build this project.
