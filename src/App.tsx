import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Subject, FormData, ScheduleResponse, ApiError } from "./types";
import {
	saveFormData,
	loadFormData,
	saveCompletionData,
	loadCompletionData,
} from "./utils/localStorage";
import { generateSchedule } from "./utils/api";
import SubjectField from "./components/SubjectField";
import ScheduleDisplay from "./components/ScheduleDisplay";
import ErrorMessage from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import Navigation from "./components/Navigation";
import QuizGenerator from "./components/QuizGenerator";
import { Plus } from "lucide-react";

const SchedulePlanner: React.FC = () => {
	const [formData, setFormData] = useState<FormData>({
		subjects: [
			{ id: uuidv4(), name: "", priority: "Medium" },
			{ id: uuidv4(), name: "", priority: "Medium" },
			{ id: uuidv4(), name: "", priority: "Medium" },
		],
		hoursPerDay: 6,
	});

	const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	// Load saved form data on initial render
	useEffect(() => {
		const savedData = loadFormData();
		if (savedData) {
			setFormData(savedData);
		}
	}, []);

	// Save form data when it changes
	useEffect(() => {
		saveFormData(formData);
	}, [formData]);

	// Load completion data when schedule is generated
	useEffect(() => {
		if (schedule) {
			const completionData = loadCompletionData();
			const updatedSchedule = {
				...schedule,
				dailySchedules: schedule.dailySchedules.map((day) => ({
					...day,
					items: day.items.map((item) => ({
						...item,
						completed: completionData[item.id] || false,
					})),
				})),
			};
			setSchedule(updatedSchedule);
		}
	}, []);

	const handleToggleComplete = (itemId: string) => {
		if (!schedule) return;

		const updatedSchedule = {
			...schedule,
			dailySchedules: schedule.dailySchedules.map((day) => ({
				...day,
				items: day.items.map((item) =>
					item.id === itemId
						? { ...item, completed: !item.completed }
						: item
				),
			})),
		};

		setSchedule(updatedSchedule);
		saveCompletionData(updatedSchedule);
	};

	const handleSubjectChange = (
		id: string,
		field: keyof Subject,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			subjects: prev.subjects.map((subject) =>
				subject.id === id ? { ...subject, [field]: value } : subject
			),
		}));
	};

	const handleAddSubject = () => {
		if (formData.subjects.length < 8) {
			setFormData((prev) => ({
				...prev,
				subjects: [
					...prev.subjects,
					{ id: uuidv4(), name: "", priority: "Medium" },
				],
			}));
		}
	};

	const handleRemoveSubject = (id: string) => {
		if (formData.subjects.length > 3) {
			setFormData((prev) => ({
				...prev,
				subjects: prev.subjects.filter((subject) => subject.id !== id),
			}));
		}
	};

	const handleHoursChange = (hours: number) => {
		setFormData((prev) => ({
			...prev,
			hoursPerDay: hours,
		}));
	};

	const validateForm = (): boolean => {
		const errors: string[] = [];

		// Check for empty subject names
		const emptySubjects = formData.subjects.some(
			(subject) => !subject.name.trim()
		);
		if (emptySubjects) {
			errors.push("All subjects must have a name");
		}

		// Check for duplicate subject names
		const subjectNames = formData.subjects.map((subject) =>
			subject.name.trim().toLowerCase()
		);
		const hasDuplicates =
			new Set(subjectNames).size !== subjectNames.length;
		if (hasDuplicates) {
			errors.push("All subjects must have unique names");
		}

		// Validate hours per day
		if (formData.hoursPerDay < 1 || formData.hoursPerDay > 24) {
			errors.push("Hours per day must be between 1 and 24");
		}

		setValidationErrors(errors);
		return errors.length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Reset previous state
		setError(null);
		setSchedule(null);

		// Validate form
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Call API to generate schedule
			const result = await generateSchedule(formData);
			setSchedule(result);
		} catch (err) {
			setError(err as ApiError);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
				<div className="container mx-auto">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold mb-2">
								Study Schedule Planner
							</h1>
							<p className="text-blue-100">
								Optimize your study time and ace your exams
							</p>
						</div>
						<Navigation />
					</div>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 max-w-4xl">
				{error && (
					<ErrorMessage
						message={error.message}
						details={error.details}
						onDismiss={() => setError(null)}
					/>
				)}

				{validationErrors.length > 0 && (
					<div className="mb-6">
						{validationErrors.map((error, index) => (
							<ErrorMessage
								key={index}
								message={error}
								onDismiss={() =>
									setValidationErrors((prev) =>
										prev.filter((_, i) => i !== index)
									)
								}
							/>
						))}
					</div>
				)}

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
					<div className="bg-blue-50 p-5 border-b border-blue-100">
						<h2 className="text-xl font-semibold text-blue-900">
							Study Preferences
						</h2>
						<p className="text-blue-700 text-sm mt-1">
							Add your subjects and set your daily study hours
						</p>
					</div>

					<form onSubmit={handleSubmit} className="p-5">
						<div className="mb-6">
							<label
								htmlFor="hoursPerDay"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Hours Available Per Day
							</label>
							<div className="flex items-center">
								<input
									id="hoursPerDay"
									type="range"
									min="1"
									max="24"
									value={formData.hoursPerDay}
									onChange={(e) =>
										handleHoursChange(
											parseInt(e.target.value)
										)
									}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
								/>
								<span className="ml-3 text-lg font-semibold text-blue-700 min-w-[3rem]">
									{formData.hoursPerDay}h
								</span>
							</div>
						</div>

						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<h3 className="text-lg font-medium text-gray-800">
									Subjects
								</h3>
								<span className="text-sm text-gray-500">
									{formData.subjects.length}/8 subjects
								</span>
							</div>

							<div className="space-y-3 mb-4">
								{formData.subjects.map((subject, index) => (
									<SubjectField
										key={subject.id}
										subject={subject}
										index={index}
										onChange={handleSubjectChange}
										onRemove={handleRemoveSubject}
										isRemovable={
											formData.subjects.length > 3
										}
									/>
								))}
							</div>

							<button
								type="button"
								onClick={handleAddSubject}
								disabled={formData.subjects.length >= 8}
								className={`flex items-center justify-center w-full p-3 text-sm font-medium rounded-md transition-all ${
									formData.subjects.length < 8
										? "text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200"
										: "text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed"
								}`}
							>
								<Plus size={16} className="mr-1" />
								Add Subject
							</button>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								className="btn btn-primary"
								disabled={isLoading}
							>
								Generate Schedule
							</button>
						</div>
					</form>
				</div>

				{isLoading ? (
					<LoadingSpinner />
				) : schedule ? (
					<ScheduleDisplay
						schedule={schedule}
						onToggleComplete={handleToggleComplete}
					/>
				) : null}
			</main>

			<footer className="bg-gray-800 text-gray-300 py-6 mt-12">
				<div className="container mx-auto px-4 text-center">
					<p>© 2025 Study Schedule Planner. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<SchedulePlanner />} />
				<Route path="/quiz-generator" element={<QuizGenerator />} />
			</Routes>
		</Router>
	);
};

export default App;
