import React from "react";
import { ScheduleResponse, ScheduleProgress } from "../types";
import { CheckCircle2, Circle, BarChart3 } from "lucide-react";

interface ScheduleDisplayProps {
	schedule: ScheduleResponse;
	onToggleComplete: (itemId: string) => void;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
	schedule,
	onToggleComplete,
}) => {
	const { dailySchedules, totalHours } = schedule;

	// Calculate progress
	const calculateProgress = (): ScheduleProgress => {
		let totalSessions = 0;
		let completedSessions = 0;
		let totalHoursCount = 0;
		let completedHoursCount = 0;
		const subjectProgress: Record<
			string,
			{ completed: number; total: number; hours: number }
		> = {};

		dailySchedules.forEach((day) => {
			day.items.forEach((item) => {
				totalSessions++;
				totalHoursCount += item.duration;

				if (!subjectProgress[item.subject]) {
					subjectProgress[item.subject] = {
						completed: 0,
						total: 0,
						hours: 0,
					};
				}
				subjectProgress[item.subject].total++;
				subjectProgress[item.subject].hours += item.duration;

				if (item.completed) {
					completedSessions++;
					completedHoursCount += item.duration;
					subjectProgress[item.subject].completed++;
				}
			});
		});

		return {
			totalSessions,
			completedSessions,
			totalHours: totalHoursCount,
			completedHours: completedHoursCount,
			subjectProgress,
		};
	};

	const progress = calculateProgress();
	const completionPercentage =
		Math.round((progress.completedHours / progress.totalHours) * 100) || 0;

	const getPriorityColor = (priority: string): string => {
		switch (priority) {
			case "High":
				return "bg-red-100 text-red-800 border-red-200";
			case "Medium":
				return "bg-amber-100 text-amber-800 border-amber-200";
			case "Low":
				return "bg-green-100 text-green-800 border-green-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	return (
		<div className="mt-8 animate-fadeIn">
			<h2 className="text-2xl font-bold text-gray-800 mb-4">
				Your Study Schedule
			</h2>

			{/* Progress Overview */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold text-gray-800">
						Overall Progress
					</h3>
					<BarChart3 className="text-blue-600" size={24} />
				</div>

				{/* Progress Bar */}
				<div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
					<div
						className="absolute h-full bg-blue-500 transition-all duration-500 ease-out"
						style={{ width: `${completionPercentage}%` }}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
					<div className="p-4 bg-blue-50 rounded-lg">
						<p className="text-sm text-blue-600 mb-1">Completion</p>
						<p className="text-2xl font-bold text-blue-700">
							{completionPercentage}%
						</p>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<p className="text-sm text-green-600 mb-1">
							Hours Completed
						</p>
						<p className="text-2xl font-bold text-green-700">
							{progress.completedHours}/{progress.totalHours}
						</p>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg">
						<p className="text-sm text-purple-600 mb-1">
							Sessions Completed
						</p>
						<p className="text-2xl font-bold text-purple-700">
							{progress.completedSessions}/
							{progress.totalSessions}
						</p>
					</div>
					<div className="p-4 bg-indigo-50 rounded-lg">
						<p className="text-sm text-indigo-600 mb-1">Subjects</p>
						<p className="text-2xl font-bold text-indigo-700">
							{Object.keys(progress.subjectProgress).length}
						</p>
					</div>
				</div>
			</div>

			{/* Subject Progress */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h3 className="text-xl font-semibold text-gray-800 mb-4">
					Subject Progress
				</h3>
				<div className="grid gap-4">
					{Object.entries(progress.subjectProgress).map(
						([subject, { completed, total, hours }]) => (
							<div
								key={subject}
								className="p-4 bg-gray-50 rounded-lg"
							>
								<div className="flex justify-between items-center mb-2">
									<h4 className="font-medium text-gray-800">
										{subject}
									</h4>
									<span className="text-sm text-gray-600">
										{completed}/{total} sessions
									</span>
								</div>
								<div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
									<div
										className="absolute h-full bg-blue-500 transition-all duration-500 ease-out"
										style={{
											width: `${
												(completed / total) * 100
											}%`,
										}}
									/>
								</div>
								<p className="text-sm text-gray-600 mt-1">
									{Math.round((completed / total) * 100)}%
									complete ({hours} hours total)
								</p>
							</div>
						)
					)}
				</div>
			</div>

			{/* Daily schedules */}
			<div className="space-y-6">
				{dailySchedules.map((day) => (
					<div
						key={day.day}
						className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
					>
						<div className="bg-indigo-600 text-white p-3">
							<h3 className="text-lg font-semibold">{day.day}</h3>
						</div>

						<div className="divide-y divide-gray-100">
							{day.items.length > 0 ? (
								day.items.map((item) => (
									<div key={item.id} className="p-4">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
											<div className="flex-1">
												<div className="flex items-center gap-2">
													<button
														onClick={() =>
															onToggleComplete(
																item.id
															)
														}
														className={`transition-colors duration-200 ${
															item.completed
																? "text-green-500 hover:text-green-600"
																: "text-gray-400 hover:text-gray-500"
														}`}
													>
														{item.completed ? (
															<CheckCircle2
																size={20}
															/>
														) : (
															<Circle size={20} />
														)}
													</button>
													<h4
														className={`font-medium ${
															item.completed
																? "text-gray-500 line-through"
																: "text-gray-800"
														}`}
													>
														{item.subject}
													</h4>
												</div>
												<p className="text-sm text-gray-500 ml-7">
													{item.timeBlock}
												</p>
											</div>

											<div className="flex items-center gap-2 ml-7 sm:ml-0">
												<span className="text-sm text-gray-600">
													{item.duration} hours
												</span>
												<span
													className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
														item.priority
													)}`}
												>
													{item.priority}
												</span>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="p-4 text-center text-gray-500">
									No study blocks scheduled
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ScheduleDisplay;
