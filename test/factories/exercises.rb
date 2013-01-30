# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :exercise do
    title "MyString"
    description "MyText"
    start "MyText"
    lesson_id 1
  end
end
