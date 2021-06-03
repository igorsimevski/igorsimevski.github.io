---
---
$(document).ready(function() {

  var ctx = document.getElementById("{{ site.data.index.skills.id }}");
  var data = {
    labels: "{{ site.data.index.skills.aspects }}".split(","),
    datasets: [{
      label: "{{ site.data.index.skills.label }}",
      backgroundColor: "rgba(179,181,198,0.2)",
      borderColor: "#3385FF",
      pointBackgroundColor: "#3385FF",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#3385FF",
      pointHoverBorderColor: "#3385FF",
      data: [{{ site.data.index.skills.percentage }}]
    }]
  };
  new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      scales: {
        ticks: {min: 0, max: 100},
        pointLabels: {
          fontSize: 20
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

});
