exports.callMLService = async (payload) => {

  // temporary mock
  return {
    type: payload.meta.queryType,

    affordability: {
      canAfford: true,
      safeLimit: 3000,
      dangerLimit: 5000
    },

    insights: {
      summary: "Mock response: you're within budget."
    },

    chatbot: {
      message: "You're good to go. This won't hurt your budget.",
      followUp: {
        required: false
      }
    }
  }
}