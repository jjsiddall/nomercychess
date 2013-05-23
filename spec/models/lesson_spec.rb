require 'spec_helper'

describe Lesson do
	describe '#next_exercise' do
		it 'returns the next exercise' do
			lesson = Lesson.create
			exercise_1 = Exercise.create(:sortForLesson => 1)
			exercise_2 = Exercise.create(:sortForLesson => 2)
			lesson.exercises << exercise_1
			lesson.exercises << exercise_2

			lesson.next_exercise(exercise_1).should == exercise_2
		end

		it 'returns nil when there are no more exercises' do
			lesson = Lesson.create
			exercise_1 = Exercise.create(:sortForLesson => 1)
			lesson.exercises << exercise_1
			lesson.next_exercise(exercise_1).should == nil
		end
	end

	describe '#sorted_exercises' do
		it 'returns the exercises in order' do
			lesson = Lesson.create
			exercise_1 = Exercise.create(:sortForLesson => 1)
			exercise_2 = Exercise.create(:sortForLesson => 2)
			exercise_3 = Exercise.create(:sortForLesson => 3)

			lesson.exercises = [exercise_2, exercise_3, exercise_1]

			lesson.sorted_exercises[0].should == exercise_1
			lesson.sorted_exercises[1].should == exercise_2
			lesson.sorted_exercises[2].should == exercise_3
		end
	end
end
