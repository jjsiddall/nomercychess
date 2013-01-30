# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :move do
    piece "MyString"
    starting_coordinate "MyString"
    ending_coordinate "MyString"
    explanation "MyText"
    exercise_id 1
    move_number 1
    computer false
  end
end
