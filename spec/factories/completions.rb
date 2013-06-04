# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :completion do
    user_id 1
    exercise_id 1
    last_completed "MyString"
  end
end
