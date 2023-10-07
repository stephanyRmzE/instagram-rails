FactoryBot.define do
  factory :user do
    username {Faker::Internet.unique.username}
  end
end
