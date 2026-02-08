import os
from dotenv import load_dotenv
from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

load_dotenv()

from kycagents.tools.ocr_tool import DocumentOcrTool

@CrewBase
class Kycagents():
    """Kycagents crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    llm = LLM(
        model=os.getenv("MODEL", "openai/rnj-1:8b"),
        base_url=os.getenv("OLLAMA_BASE_URL", "https://ollama.com/v1"),
        api_key=os.getenv("OLLAMA_API_KEY"),
        temperature=0.7
    )

    @agent
    def pdf_ocr_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['pdf_ocr_agent'], # type: ignore[index]
            verbose=True,
            llm=self.llm,
            tools=[DocumentOcrTool()]
        )

    @agent
    def image_ocr_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['image_ocr_agent'], # type: ignore[index]
            verbose=True,
            llm=self.llm,
            tools=[DocumentOcrTool()]
        )

    @task
    def pdf_ocr_task(self) -> Task:
        return Task(
            config=self.tasks_config['pdf_ocr_task'], # type: ignore[index]
        )

    @task
    def image_ocr_task(self) -> Task:
        return Task(
            config=self.tasks_config['image_ocr_task'], # type: ignore[index]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Kycagents crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
